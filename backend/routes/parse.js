import express from 'express'
import prisma from '../lib/prisma.js'
import { authenticateToken } from '../middleware/auth.js'
import { parseQueue } from '../queue/index.js'

const router = express.Router()

router.post('/:reportFileId/parse', authenticateToken, async (req, res) => {
  try {
    const reportFileId = Number(req.params.reportFileId)
    const record = await prisma.reportsFile.findUnique({ where: { id: reportFileId } })
    if (!record) return res.status(404).json({ message: 'report_file not found' })

    const job = await parseQueue.add('parse-report', { reportFileId })
    return res.json({ jobId: job.id, status: 'queued' })
  } catch (e) {
    console.error('Enqueue parse error:', e)
    return res.status(500).json({ message: 'Queue failed' })
  }
})

export default router
