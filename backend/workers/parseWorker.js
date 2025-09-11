import { GetObjectCommand } from '@aws-sdk/client-s3'
import { s3, S3_BUCKET } from '../lib/s3.js'
import prisma from '../lib/prisma.js'
import { createParseWorker } from '../queue/index.js'
import * as XLSX from 'xlsx'
import pdfParse from 'pdf-parse'

async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', (c) => chunks.push(c))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}

createParseWorker(async (job) => {
  const { reportFileId } = job.data
  const rec = await prisma.reportsFile.findUnique({ where: { id: reportFileId } })
  if (!rec) return

  const obj = await s3.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: rec.filePath }))
  const buf = await streamToBuffer(obj.Body)

  // Create report entry
  const report = await prisma.reports.create({
    data: {
      organizationId: rec.organizationId,
      reportFileId: rec.id,
      reportName: rec.fileName,
      reportType: rec.fileType,
      status: 'processing'
    }
  })

  if (rec.fileType === 'excel') {
    const wb = XLSX.read(buf, { type: 'buffer' })
    const sheet = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet)
    for (const row of rows) {
      // Minimal mapping; extend as needed
      await prisma.reportAsset.create({
        data: {
          reportId: report.id,
          assetName: String(row.asset_name || row.name || 'Unknown'),
          assetType: String(row.asset_type || row.type || 'Unknown'),
          environment: String(row.environment || 'Production'),
          compliancePercent: Number(row.compliance_percent || 0),
          riskLevel: String(row.risk_level || 'Not Assessed'),
        }
      })
    }
  } else if (rec.fileType === 'pdf') {
    // MVP: extract metadata/text length
    const parsed = await pdfParse(buf)
    await prisma.customerTrust.create({
      data: {
        organizationId: rec.organizationId,
        reportId: report.id,
        metric: 'pdf_pages',
        value: parsed.numpages || 0
      }
    })
  }

  await prisma.reports.update({ where: { id: report.id }, data: { status: 'completed' } })
})

