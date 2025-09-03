import React from 'react'
import { Card, CardContent, CardHeader } from '../components/ui'
import { BookOpen, Shield, Users, Settings, Bell, FileText } from 'lucide-react'

export default function StarterGuide() {
  const steps = [
    {
      icon: Shield,
      title: 'System Setup',
      description: 'Configure your security parameters and initial settings',
      details: [
        'Set up your organization profile',
        'Configure security policies',
        'Define threat detection rules',
        'Set up notification preferences'
      ]
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Add team members and assign appropriate roles',
      details: [
        'Create user accounts',
        'Assign roles and permissions',
        'Set up access controls',
        'Configure user groups'
      ]
    },
    {
      icon: Bell,
      title: 'Alert Configuration',
      description: 'Configure how you receive security notifications',
      details: [
        'Set up email notifications',
        'Configure SMS alerts',
        'Define alert thresholds',
        'Set up escalation procedures'
      ]
    },
    {
      icon: FileText,
      title: 'Reporting Setup',
      description: 'Configure automated reporting and dashboards',
      details: [
        'Set up scheduled reports',
        'Configure dashboard widgets',
        'Define report templates',
        'Set up data retention policies'
      ]
    },
    {
      icon: Settings,
      title: 'Integration Setup',
      description: 'Connect with external security tools and services',
      details: [
        'Connect SIEM systems',
        'Integrate with threat feeds',
        'Set up API connections',
        'Configure data sources'
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Starter Guide
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-neutral-400">
          Get started with DefendSphere in 5 simple steps
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <Card key={index}>
              <CardHeader className="p-6 pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-medium">
                        {index + 1}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-gray-600 dark:text-neutral-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-neutral-300">
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">
              Ready to get started?
            </h3>
            <p className="mt-2 text-blue-700 dark:text-blue-200">
              Follow these steps to set up your DefendSphere environment. 
              Need help? Contact our support team.
            </p>
            <div className="mt-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700">
                Contact Support
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}