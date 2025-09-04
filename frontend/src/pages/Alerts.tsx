import { useState } from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { alerts as initialAlerts } from '../data/mockData'

export default function Alerts() {
  const [ack, setAck] = useState<number[]>([])
  function toggle(id: number) {
    setAck(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {initialAlerts.map(a => (
        <Card key={a.id}>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-sm font-semibold">{a.title}</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-neutral-300">{a.description}</p>
            <Button onClick={() => toggle(a.id)} className={ack.includes(a.id) ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700' : ''}>
              {ack.includes(a.id) ? 'Acknowledged' : 'Acknowledge'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

