# Dashboard & Sidebar

## Fixed Sidebar Structure

Order is always:
1. Home
2. Starter Guide
3. Assets
4. Reports
5. Compliance
6. Customer Trust
7. Suppliers
8. Integrations (Admin only)

## Access Rules
- Sections are hidden if the user lacks permission (order preserved)
- Integrations is visible only for Admin role
- No other sections are displayed in the sidebar

## UI/UX
- Sidebar background: #003a6a; text: #ffffff
- Bottom user block: initials + username + Logout
- Main content uses Inter font, #f8f9fa background

## New Sections

- Admin Panel: “User management and system administration” (admin only)
- User Dashboard: “Personal profile and settings” (all users)

## Ordering

- Sections appear after existing ones, preserving fixed order.

## Access Rules

- Admin Panel: requires admin role
- User Dashboard: visible for all authenticated users
- Organization policy: users in the same organization share access to Reports, Compliance, Assets, Suppliers