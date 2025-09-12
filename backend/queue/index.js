import bullmq from 'bullmq'
const { Queue, Worker } = bullmq
import { createClient } from 'redis'

const connection = { url: process.env.REDIS_URL || 'redis://redis:6380' }

export const parseQueue = new Queue('report-parse', { connection })

export function createParseWorker(processor) {
  return new Worker('report-parse', processor, { connection })
}
