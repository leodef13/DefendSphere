import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../components/ui'
import { useAuth } from '../components/AuthProvider'
import { useI18n } from '../i18n'
import { API_ENDPOINTS } from '../config/api'
import { Building2, User, Mail, Phone, Server, Shield, Users, FileText } from 'lucide-react'

interface UserProfile {
  companyName: string
  userName: string
  email: string
  phone: string
  registeredSystems: number
  recommendedStandards: string[]
  contacts: {
    dpo: {
      name: string
      email: string
      phone: string
    }
    ciso: {
      name: string
      email: string
      phone: string
    }
  }
}

const StarterGuide: React.FC = () => {
  const { t } = useI18n()
  const { token, user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isCompanyLLD = Array.isArray(user?.organizations) && user!.organizations!.includes('Company LLD')

  useEffect(() => {
    if (isCompanyLLD) {
      fetchUserProfile()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchUserProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(API_ENDPOINTS.REPORTS_PROFILE, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user profile')
      }

      const data = await response.json()
      setProfile(data.profile)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6">Loading starter guide...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold">Starter Guide - Company LLD Security Assessment</h1>
      </div>

      {isCompanyLLD && profile ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Company Information</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Company Name</label>
                  <p className="text-lg font-semibold">{profile.companyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Registered Systems</label>
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-semibold">{profile.registeredSystems} System</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">User Information</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Username</label>
                  <p className="text-lg font-semibold">{profile.userName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>{profile.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span>{profile.phone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Standards */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Recommended Standards</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.recommendedStandards.map((standard, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{standard}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Contacts */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold">Key Contacts</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Data Protection Officer (DPO)</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>{profile.contacts.dpo.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span>{profile.contacts.dpo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{profile.contacts.dpo.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Chief Information Security Officer (CISO)</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>{profile.contacts.ciso.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span>{profile.contacts.ciso.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{profile.contacts.ciso.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Interactive Security Assessment</h3>
              <p className="text-gray-600 mb-4">
                Complete your security assessment questionnaire to get personalized recommendations and access to detailed reports.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This starter guide is currently showing sample data for user1. 
                  Complete the assessment to see your personalized security recommendations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default StarterGuide