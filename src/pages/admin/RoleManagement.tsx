import React, { useState } from 'react'
import { Card, CardContent, CardHeader, Button } from '../../components/ui'
import { UserCheck, Plus, Edit, Trash2, Shield, Users, Settings } from 'lucide-react'

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  createdAt: string
  isSystem: boolean
}

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      permissions: ['all'],
      userCount: 1,
      createdAt: '2024-01-01',
      isSystem: true
    },
    {
      id: '2',
      name: 'Security Admin',
      description: 'Security-focused administrative access',
      permissions: [
        'access.dashboard',
        'access.incidents',
        'access.alerts',
        'access.compliance',
        'access.reports',
        'manage.users',
        'manage.roles'
      ],
      userCount: 2,
      createdAt: '2024-01-15',
      isSystem: false
    },
    {
      id: '3',
      name: 'Security Analyst',
      description: 'Security monitoring and incident response',
      permissions: [
        'access.dashboard',
        'access.incidents',
        'access.alerts',
        'access.reports',
        'access.compliance'
      ],
      userCount: 5,
      createdAt: '2024-02-01',
      isSystem: false
    },
    {
      id: '4',
      name: 'Standard User',
      description: 'Basic access to dashboard and reports',
      permissions: [
        'access.dashboard',
        'access.reports'
      ],
      userCount: 16,
      createdAt: '2024-02-15',
      isSystem: false
    }
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const availablePermissions = [
    { category: 'Access Control', permissions: [
      'access.dashboard',
      'access.home',
      'access.starterGuide',
      'access.reports',
      'access.compliance',
      'access.customerTrust',
      'access.suppliers',
      'access.assets',
      'access.integrations',
      'access.incidents',
      'access.alerts',
      'access.settings',
      'access.profile'
    ]},
    { category: 'User Management', permissions: [
      'manage.users',
      'manage.roles',
      'view.users',
      'view.roles'
    ]},
    { category: 'System Administration', permissions: [
      'system.backup',
      'system.restore',
      'system.config',
      'system.logs'
    ]},
    { category: 'Security Operations', permissions: [
      'security.incidents',
      'security.alerts',
      'security.policies',
      'security.audit'
    ]}
  ]

  const deleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    if (role?.isSystem) {
      alert('System roles cannot be deleted')
      return
    }
    if (role?.userCount > 0) {
      alert('Cannot delete role with active users')
      return
    }
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(role => role.id !== roleId))
    }
  }

  const getPermissionColor = (permission: string) => {
    if (permission === 'all') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    if (permission.startsWith('access.')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    if (permission.startsWith('manage.')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (permission.startsWith('system.')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    if (permission.startsWith('security.')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Management</h1>
          <p className="text-gray-600 dark:text-neutral-400">
            Define and manage user roles and permissions
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </div>

      {/* Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Total Roles</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-300">{roles.length}</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">defined roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Total Users</h3>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-300">
              {roles.reduce((sum, role) => sum + role.userCount, 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">assigned users</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">System Roles</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-300">
              {roles.filter(role => role.isSystem).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">protected roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <Settings className="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Custom Roles</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600 dark:text-orange-300">
              {roles.filter(role => !role.isSystem).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">user-defined</p>
          </CardContent>
        </Card>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader className="p-4 pb-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Roles</h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Role</th>
                  <th className="text-left px-4 py-2 font-medium">Description</th>
                  <th className="text-left px-4 py-2 font-medium">Users</th>
                  <th className="text-left px-4 py-2 font-medium">Permissions</th>
                  <th className="text-left px-4 py-2 font-medium">Created</th>
                  <th className="text-left px-4 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-t border-gray-100 dark:border-neutral-800">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{role.name}</div>
                          {role.isSystem && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              System
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-neutral-400 max-w-xs">
                      {role.description}
                    </td>
                    <td className="px-4 py-2">
                      <span className="font-medium text-gray-900 dark:text-white">{role.userCount}</span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {role.permissions.slice(0, 3).map((permission, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPermissionColor(permission)}`}
                          >
                            {permission}
                          </span>
                        ))}
                        {role.permissions.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                            +{role.permissions.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-neutral-400">{role.createdAt}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingRole(role)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteRole(role.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={role.isSystem || role.userCount > 0}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Role Modal */}
      {(showCreateModal || editingRole) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {editingRole ? 'Edit Role' : 'Create New Role'}
            </h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                    Role Name
                  </label>
                  <input
                    type="text"
                    defaultValue={editingRole?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-900 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    defaultValue={editingRole?.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-3">
                  Permissions
                </label>
                <div className="space-y-4">
                  {availablePermissions.map((category) => (
                    <div key={category.category} className="border border-gray-200 dark:border-neutral-700 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{category.category}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {category.permissions.map((permission) => (
                          <label key={permission} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              defaultChecked={editingRole?.permissions.includes(permission) || false}
                              className="rounded border-gray-300 dark:border-neutral-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-neutral-300">{permission}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                >
                  {editingRole ? 'Update Role' : 'Create Role'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingRole(null)
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}