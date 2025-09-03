import React from 'react'
import { Card, CardContent, CardHeader } from '../components/ui'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { Shield, TrendingUp, Users, Activity } from 'lucide-react'

export default function Home() {
  const { t } = useLanguage()
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to DefendSphere
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-neutral-400">
          Comprehensive security monitoring and threat management platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Active Protections</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Real-time monitoring and threat prevention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Performance</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Optimized security operations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Team Collaboration</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Multi-user access and role management
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <Activity className="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Real-time Alerts</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Instant notification system
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">View Recent Incidents</div>
                <div className="text-sm text-gray-600 dark:text-neutral-400">Check latest security events</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">Generate Security Report</div>
                <div className="text-sm text-gray-600 dark:text-neutral-400">Create comprehensive security overview</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                <div className="font-medium text-gray-900 dark:text-white">Check System Status</div>
                <div className="text-sm text-gray-600 dark:text-neutral-400">Monitor system health and performance</div>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">System Overview</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-neutral-400">System Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-neutral-400">Last Update</span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date().toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-neutral-400">User Role</span>
                <span className="text-sm text-gray-900 dark:text-white capitalize">
                  {user?.role || 'user'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-neutral-400">Active Sessions</span>
                <span className="text-sm text-gray-900 dark:text-white">1</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}