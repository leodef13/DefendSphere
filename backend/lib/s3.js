import { S3Client } from '@aws-sdk/client-s3'

const REGION = 'us-east-1'

export const s3 = new S3Client({
  region: REGION,
  endpoint: `http://${process.env.MINIO_ENDPOINT || 'minio'}:${process.env.MINIO_PORT || '9000'}`,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  },
})

export const S3_BUCKET = process.env.MINIO_BUCKET || 'reports'
