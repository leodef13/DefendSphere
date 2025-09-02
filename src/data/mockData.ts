export const metrics = [
  { title: 'Active Defenses', value: 128, icon: 'shield-check' },
  { title: 'Blocked Threats', value: 2314, icon: 'ban' },
  { title: 'System Uptime', value: '99.98%', icon: 'timer' },
  { title: 'Pending Alerts', value: 7, icon: 'bell-ring' },
]

export const threatsOverTime = [
  { date: 'Day 1', count: 42 },
  { date: 'Day 2', count: 38 },
  { date: 'Day 3', count: 55 },
  { date: 'Day 4', count: 61 },
  { date: 'Day 5', count: 49 },
  { date: 'Day 6', count: 72 },
  { date: 'Day 7', count: 58 },
]

export const threatTypes = [
  { name: 'Malware', value: 45 },
  { name: 'Phishing', value: 30 },
  { name: 'DDoS', value: 15 },
  { name: 'Other', value: 10 },
]

export type Incident = {
  time: string
  type: string
  severity: 'High' | 'Medium' | 'Low'
  status: 'Blocked' | 'Resolved' | 'Active'
}

export const recentIncidents: Incident[] = [
  { time: '08:30 AM', type: 'Malware', severity: 'High', status: 'Blocked' },
  { time: '09:10 AM', type: 'Phishing', severity: 'Medium', status: 'Resolved' },
  { time: '10:15 AM', type: 'DDoS', severity: 'High', status: 'Active' },
  { time: '11:40 AM', type: 'Other', severity: 'Low', status: 'Blocked' },
]

export const allIncidents: Incident[] = Array.from({ length: 42 }).map((_, i) => {
  const severities: Incident['severity'][] = ['High', 'Medium', 'Low']
  const statuses: Incident['status'][] = ['Blocked', 'Resolved', 'Active']
  const types = ['Malware', 'Phishing', 'DDoS', 'Other']
  return {
    time: `${(8 + (i % 10)).toString().padStart(2, '0')}:${(i * 7) % 60 === 0 ? '00' : ((i * 7) % 60).toString().padStart(2, '0')} AM`,
    type: types[i % types.length],
    severity: severities[i % severities.length],
    status: statuses[i % statuses.length],
  }
})

export const alerts = [
  { id: 1, title: 'Suspicious Login Detected', description: 'Unusual login from a new device in Germany.' },
  { id: 2, title: 'Malware Signature Update', description: 'New signatures available for immediate update.' },
  { id: 3, title: 'High Traffic Spike', description: 'Potential DDoS pattern identified in region US-East.' },
]

