import { Queue, Worker, QueueScheduler } from 'bullmq'
import { createClient } from 'redis'

const connection = {
  url: process.env.REDIS_URL || 'redis://localhost:6380'
}

export const parseQueue = new Queue('report-parse', { connection })
export const parseScheduler = new QueueScheduler('report-parse', { connection })

export function createParseWorker(processor) {
  return new Worker('report-parse', processor, { connection })
}
