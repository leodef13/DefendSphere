import React from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui'
import { Users, Shield, Activity, AlertTriangle, TrendingUp, Database, Server, Clock } from 'lucide-react'

export default function AdminDashboard() {
  const metrics = [
    {
      title: 'Total Users',
      value: '24',
      change: '+3',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
    },
    {
      title: 'Active Sessions',
      value: '18',
      change: '-2',
      changeType: 'negative',
      icon: Activity,
      color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
    },
    {
      title: 'Security Score',
      value: '87%',
      change: '+5%',
      changeType: 'positive',
      icon: Shield,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: '+0.1%',
      changeType: 'positive',
      icon: Server,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      action: 'User created',
      user: 'john.doe@company.com',
      timestamp: '2 minutes ago',
      type: 'user'
    },
    {
      id: 2,
      action: 'Role permissions updated',
      user: 'admin@company.com',
      timestamp: '15 minutes ago',
      type: 'role'
    },
    {
      id: 3,
      action: 'Security policy modified',
      user: 'security@company.com',
      timestamp: '1 hour ago',
      type: 'policy'
    },
    {
      id: 4,
      action: 'System backup completed',
      user: 'system@company.com',
      timestamp: '2 hours ago',
      type: 'system'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="h-4 w-4" />
      case 'role':
        return <Shield className="h-4 w-4" />
      case 'policy':
        return <AlertTriangle className="h-4 w-4" />
      case 'system':
        return <Server className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
      case 'role':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
      case 'policy':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
      case 'system':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-neutral-400">
          System overview and administrative controls
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className={`text-sm ${
                        metric.changeType === 'positive' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {metric.change}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-neutral-400 ml-1">
                        from last week
                      </span>
                    </div>
                  </div>
                  <div className={`h-12 w-12 rounded-full ${metric.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">System Health</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-neutral-400">Database Performance</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">95%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-neutral-400">API Response Time</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">88%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-neutral-400">Memory Usage</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">72%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-neutral-400">Disk Space</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">65%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Create New User</div>
                    <div className="text-sm text-gray-600 dark:text-neutral-400">Add a new user to the system</div>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Manage Roles</div>
                    <div className="text-sm text-gray-600 dark:text-neutral-400">Configure user roles and permissions</div>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">System Backup</div>
                    <div className="text-sm text-gray-600 dark:text-neutral-400">Create system backup</div>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4 pb-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Administrative Activities</h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Action</th>
                  <th className="text-left px-4 py-2 font-medium">User</th>
                  <th className="text-left px-4 py-2 font-medium">Timestamp</th>
                  <th className="text-left px-4 py-2 font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity) => (
                  <tr key={activity.id} className="border-t border-gray-100 dark:border-neutral-800">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{activity.action}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-neutral-400">{activity.user}</td>
                    <td className="px-4 py-2 text-gray-600 dark:text-neutral-400">{activity.timestamp}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                        {activity.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}