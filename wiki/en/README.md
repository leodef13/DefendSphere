# Wiki (EN)

- [Quick Start](./quick-start.md)
- [AI Assistant Integration](./ai-assistant-integration.md)
- Sidebar sections:
  - Admin Panel — user management and system administration (admins only)
  - User Dashboard — personal profile and settings (all users)
- Organization-based access: members of the same organization share access to Reports, Compliance, Assets, Suppliers.

## Static PNG Visualizations (Company LLD)

The dashboard references static images at deployment time (not stored in repo):

- `/reports/organizations/CompanyLLDL/total_security_health.png`
- `/reports/organizations/CompanyLLDL/high_problems.png`
- `/reports/organizations/CompanyLLDL/critical_problems.png`
- `/reports/organizations/CompanyLLDL/medium_problems.png`
- `/reports/organizations/CompanyLLDL/low_problems.png`
- `/reports/organizations/CompanyLLDL/Vulsecheal.png`

## Profile Update Endpoint

Use `PUT /api/users/profile` with body:

```
{
  "email": "new@example.com",
  "currentPassword": "optional",
  "newPassword": "optional"
}
```

## Navigation Cleanup

Incidents/Alerts are not part of the UI and were removed from navigation and tests.