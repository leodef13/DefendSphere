import express from 'express'
import multer from 'multer'
import mime from 'mime-types'
import { PutObjectCommand, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3'
import { s3, S3_BUCKET } from '../lib/s3.js'
import prisma from '../lib/prisma.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['pdf', 'xlsx', 'xls', 'csv']
    const ext = mime.extension(file.mimetype) || ''
    if (allowed.includes(ext)) return cb(null, true)
    return cb(new Error('Unsupported file type'))
  }
})

async function ensureBucket() {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: S3_BUCKET }))
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: S3_BUCKET }))
  }
}

router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    await ensureBucket()
    const { organizationId } = req.body
    const file = req.file
    if (!file) return res.status(400).json({ message: 'File is required' })
    if (!organizationId) return res.status(400).json({ message: 'organizationId is required' })

    const ext = mime.extension(file.mimetype) || 'bin'
    const key = `org-${organizationId}/${Date.now()}-${file.originalname}`

    await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    }))

    const created = await prisma.reportsFile.create({
      data: {
        organizationId: Number(organizationId),
        uploadedBy: Number(req.user.id || 0),
        fileName: file.originalname,
        fileType: ext === 'pdf' ? 'pdf' : 'excel',
        filePath: key,
      }
    })

    return res.status(201).json({ report_file_id: created.id, file_type: created.fileType, status: 'uploaded' })
  } catch (e) {
    console.error('Upload error:', e)
    return res.status(500).json({ message: 'Upload failed' })
  }
})

export default router
