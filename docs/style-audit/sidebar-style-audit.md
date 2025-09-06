# Sidebar Style Audit

## Sources & Import Order

- frontend/src/main.tsx: imports `./index.css` (single global stylesheet)
- No other global CSS imports found; Tailwind not used (no @tailwind directives)
- Component-level inline styles in `frontend/src/layouts/MainLayout.tsx`

## Potential Conflicts

- Tailwind preflight: not present
- Bootstrap/MUI/AntD: not present
- lucide-react icons used explicitly in components
- Inline styles set active item background on NavLink

## Affected Selectors

- `.sidebar`
- `.sidebar a`
- `.sidebar .menu-item`
- hover/active states of sidebar links

## Winning Rules & Specificity

| Selector | Specificity | Source | Effect |
|---------|-------------|--------|--------|
| `.sidebar a` | 0-0-1-1 | frontend/src/index.css | Forces white text |
| `.sidebar a:hover` | 0-0-1-1 | frontend/src/index.css | White text on hover + translucent bg |
| Inline style (NavLink bg) | inline | MainLayout.tsx | Active background color |

## Root Causes

1) Icons in sidebar rendered explicitly via lucide-react in `MainLayout.tsx`
2) Missing explicit white hover color causing inconsistencies

## Fixes Applied

- Removed icon rendering from sidebar list in `frontend/src/layouts/MainLayout.tsx`
- Added high-priority CSS rules in `frontend/src/index.css`:
  - `.sidebar a, .sidebar .menu-item { color: #ffffff !important; }`
  - `.sidebar a:hover, .sidebar .menu-item:hover { color: #ffffff !important; background-color: rgba(255,255,255,0.1); }`
- Verified stylesheet order: `index.css` imported from `main.tsx` (no competing global CSS)
- (Optional) For list markers prevention: `.sidebar ul, .sidebar li { list-style: none; }`

## Verification

- Sidebar text is white in normal/hover/active states
- No unintended icons present
- Section order and role-based visibility preserved