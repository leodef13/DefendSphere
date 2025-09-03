import React from 'react'
import { Card, CardContent, CardHeader } from '../components/ui'
import { Heart, Shield, Users, TrendingUp } from 'lucide-react'

export default function CustomerTrust() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Customer Trust
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-neutral-400">
          Build and maintain customer confidence through transparency and security
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Heart className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Trust Score</h3>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-300">94%</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">customer satisfaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Security Rating</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-300">A+</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">industry standard</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Active Customers</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-300">2,847</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">trusting our platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Growth Rate</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600 dark:text-orange-300">+23%</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">month over month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Trust Indicators</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-neutral-400">Data Encryption</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-neutral-400">Privacy Compliance</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Compliant
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-neutral-400">Third-party Audits</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Passed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-neutral-400">Incident Response</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  < 1 hour
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Customer Feedback</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  "Excellent security features and transparent communication about data protection."
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">- Enterprise Customer</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  "The compliance reports give us confidence in our security posture."
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">- Financial Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4 pb-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Transparency Initiatives</h3>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Security Reports</h4>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Monthly security posture reports available to all customers
              </p>
            </div>
            <div className="text-center p-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3">
                <Heart className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Privacy Dashboard</h4>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Real-time visibility into data handling and privacy controls
              </p>
            </div>
            <div className="text-center p-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-3">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-300" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Customer Advisory Board</h4>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Regular meetings to discuss security priorities and improvements
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}