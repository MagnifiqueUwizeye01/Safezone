# SafeZone Color Scheme

This document defines the color scheme used throughout the SafeZone application to ensure consistency across all pages.

## Primary Colors

### Blue (Primary Brand Color)
- **blue-50**: `#eff6ff` - Light backgrounds
- **blue-100**: `#dbeafe` - Badges, highlights
- **blue-600**: `#2563eb` - Primary buttons, links, icons
- **blue-700**: `#1d4ed8` - Hover states
- **blue-800**: `#1e40af` - Darker gradients

### Usage:
- Primary buttons: `bg-blue-600 hover:bg-blue-700`
- Links: `text-blue-600 hover:text-blue-700`
- Icons: `text-blue-600`
- Gradients: `from-blue-600 to-blue-800`

## Neutral Colors

### Slate (Text & Backgrounds)
- **slate-50**: `#f8fafc` - Page backgrounds
- **slate-100**: `#f1f5f9` - Light backgrounds
- **slate-200**: `#e2e8f0` - Borders
- **slate-300**: `#cbd5e1` - Dividers
- **slate-600**: `#475569` - Secondary text
- **slate-700**: `#334155` - Body text
- **slate-900**: `#0f172a` - Headings

### Usage:
- Page backgrounds: `bg-slate-50` or `bg-gradient-to-br from-blue-50 via-white to-slate-50`
- Cards: `bg-white border border-slate-200`
- Text: `text-slate-900` (headings), `text-slate-600` (body)
- Borders: `border-slate-200` or `border-slate-300`

## Accent Colors

### Red (Errors, Alerts)
- **red-50**: `#fef2f2` - Alert backgrounds
- **red-100**: `#fee2e2` - Badge backgrounds
- **red-600**: `#dc2626` - Error text, danger buttons
- **red-700**: `#b91c1c` - Hover states

### Yellow (Warnings)
- **yellow-50**: `#fefce8` - Warning backgrounds
- **yellow-100**: `#fef9c3` - Badge backgrounds
- **yellow-600**: `#ca8a04` - Warning icons

### Green (Success)
- **green-50**: `#f0fdf4` - Success backgrounds
- **green-100**: `#dcfce7` - Badge backgrounds
- **green-600**: `#16a34a` - Success text, success buttons
- **green-700**: `#15803d` - Hover states

## Component Color Patterns

### Buttons
- Primary: `bg-blue-600 text-white hover:bg-blue-700`
- Secondary: `bg-slate-200 text-slate-900 hover:bg-slate-300`
- Outline: `border-2 border-blue-600 text-blue-600 hover:bg-blue-50`
- Danger: `bg-red-600 text-white hover:bg-red-700`
- Success: `bg-green-600 text-white hover:bg-green-700`

### Cards
- Background: `bg-white`
- Border: `border border-slate-200`
- Shadow: `shadow-xl` or `shadow-lg`
- Rounded: `rounded-2xl`

### Forms
- Input background: `bg-white`
- Input border: `border border-slate-300`
- Input focus: `focus:ring-2 focus:ring-blue-500`
- Label: `text-slate-700`
- Error: `text-red-600 border-red-500`

### Navigation
- Background: `bg-white/80 backdrop-blur-md`
- Border: `border-b border-slate-200`
- Links: `text-slate-700 hover:text-blue-600`

## Page Backgrounds

### Home Page
- Main: `bg-gradient-to-b from-slate-50 to-white`
- Hero: `bg-gradient-to-br from-blue-50 via-white to-slate-50`
- Sections: `bg-white` or `bg-slate-50`

### Auth Pages (Login, Register)
- Background: `bg-gradient-to-br from-blue-50 via-white to-slate-50`
- Card: `bg-white rounded-2xl shadow-xl border border-slate-200`

### Dashboard Pages
- Background: `bg-slate-50`
- Cards: `bg-white rounded-xl shadow-sm border border-slate-200`

## Shadows

- Small: `shadow-sm`
- Medium: `shadow-lg`
- Large: `shadow-xl`
- Colored (blue): `shadow-lg shadow-blue-600/30`
- Colored (large): `shadow-xl shadow-blue-600/30`

## Text Gradients

- Brand gradient: `bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent`

## Implementation Notes

1. Always use Tailwind CSS classes - no custom CSS colors
2. Maintain consistency across all pages
3. Use semantic color names (blue for primary, red for errors, etc.)
4. Test hover states for all interactive elements
5. Ensure sufficient contrast for accessibility

