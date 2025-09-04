import { Card, CardContent } from './ui'
import { ShieldCheck, Ban, Timer, BellRing } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<any>> = {
  'shield-check': ShieldCheck,
  'ban': Ban,
  'timer': Timer,
  'bell-ring': BellRing,
}

export default function MetricCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  const Icon = iconMap[icon] ?? ShieldCheck
  return (
    <Card className="h-full">
      <CardContent className="flex items-center justify-between p-4 md:p-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-neutral-400">{title}</p>
          <p className="text-2xl md:text-3xl font-semibold mt-1">{value}</p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300 flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}


