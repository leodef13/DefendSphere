# Stylesheet Order & Precedence

1) Global CSS imports
- Import the main global stylesheet from the root entry (frontend/src/main.tsx):
  - `import './index.css'`
- Ensure it loads after any library CSS to allow overrides

2) Tailwind (if introduced in future)
- Use order: `@tailwind base; @tailwind components; @tailwind utilities;`
- Custom overrides should appear after utilities in `@layer utilities` or in a file imported last

3) Sidebar Rules
- Force white text and hover:
```
.sidebar a, .sidebar .menu-item { color: #ffffff !important; }
.sidebar a:hover, .sidebar .menu-item:hover { color: #ffffff !important; background-color: rgba(255,255,255,0.1); }
```
- Prefer specificity over `!important` where possible, but use `!important` for library overrides

4) Icons
- Do not render icons in Sidebar unless explicitly required by design
- Remove icon components/props from menu generation

5) Debugging
- Use browser devtools to inspect computed styles and rule order
- Check for inline styles and CSS-in-JS that may increase specificity