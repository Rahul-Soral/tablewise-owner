# Owner Portal - Design System Documentation

## Overview

This document outlines the design system for the Owner Portal, including color palettes, typography, spacing, and component guidelines.

## 🎨 Color Palette

### Background Colors (Warm Neutrals)
```css
--color-bg-primary: #FAFAF9     /* Main background - warm off-white */
--color-bg-secondary: #F5F5F4   /* Secondary background - light warm gray */
--color-bg-tertiary: #E7E5E4    /* Tertiary background - medium warm gray */
--color-bg-elevated: #FFFFFF    /* Elevated surfaces (cards) - pure white */
```

### Primary Colors (Deep Blue/Indigo)
```css
Primary 50:  #EFF6FF
Primary 100: #DBEAFE
Primary 200: #BFDBFE
Primary 300: #93C5FD
Primary 400: #60A5FA
Primary 500: #3B82F6  /* Main primary */
Primary 600: #2563EB  /* Primary hover */
Primary 700: #1E40AF
Primary 800: #1E3A8A
Primary 900: #1E293B
```

### Teal Accent
```css
Teal 50:  #F0FDFA
Teal 100: #CCFBF1
Teal 200: #99F6E4
Teal 300: #5EEAD4
Teal 400: #2DD4BF
Teal 500: #14B8A6  /* Main teal */
Teal 600: #0D9488  /* Teal hover */
Teal 700: #0F766E
Teal 800: #115E59
Teal 900: #134E4A
```

### Orange Accent (Highlights & CTAs)
```css
Accent 50:  #FFF7ED
Accent 100: #FFEDD5
Accent 200: #FED7AA
Accent 300: #FDBA74
Accent 400: #FB923C
Accent 500: #F97316  /* Main accent */
Accent 600: #EA580C  /* Accent hover */
Accent 700: #C2410C
Accent 800: #9A3412
Accent 900: #7C2D12
```

### Success (Green)
```css
Success 50:  #F0FDF4
Success 100: #DCFCE7
Success 200: #BBF7D0
Success 300: #86EFAC
Success 400: #4ADE80
Success 500: #22C55E  /* Main success */
Success 600: #16A34A  /* Success hover */
Success 700: #15803D
Success 800: #166534
Success 900: #14532D
```

### Danger (Red)
```css
Danger 50:  #FEF2F2
Danger 100: #FEE2E2
Danger 200: #FECACA
Danger 300: #FCA5A5
Danger 400: #F87171
Danger 500: #EF4444  /* Main danger */
Danger 600: #DC2626  /* Danger hover */
Danger 700: #B91C1C
Danger 800: #991B1B
Danger 900: #7F1D1D
```

### Warning (Amber)
```css
Warning 50:  #FFFBEB
Warning 100: #FEF3C7
Warning 200: #FDE68A
Warning 300: #FCD34D
Warning 400: #FBBF24
Warning 500: #F59E0B  /* Main warning */
Warning 600: #D97706  /* Warning hover */
Warning 700: #B45309
Warning 800: #92400E
Warning 900: #78350F
```

### Text Colors (Muted)
```css
--color-text-primary: #1C1917      /* Almost black - main text */
--color-text-secondary: #57534E    /* Medium gray - secondary text */
--color-text-tertiary: #78716C     /* Light gray - tertiary text */
--color-text-disabled: #A8A29E     /* Very light gray - disabled text */
--color-text-inverse: #FAFAF9      /* Light text for dark backgrounds */
```

### Border Colors
```css
--color-border-light: #E7E5E4      /* Light border */
--color-border-medium: #D6D3D1     /* Medium border */
--color-border-dark: #A8A29E       /* Dark border */
--color-border-focus: #3B82F6      /* Focus ring */
```

## 📏 Spacing Scale

```css
0:  0
1:  0.25rem  (4px)
2:  0.5rem   (8px)
3:  0.75rem  (12px)
4:  1rem     (16px)
5:  1.25rem  (20px)
6:  1.5rem   (24px)
8:  2rem     (32px)
10: 2.5rem   (40px)
12: 3rem     (48px)
16: 4rem     (64px)
20: 5rem     (80px)
24: 6rem     (96px)
```

## 🔘 Border Radius

```css
none: 0
sm:   0.25rem  (4px)
base: 0.5rem   (8px)
md:   0.75rem  (12px)
lg:   1rem     (16px)
xl:   1.5rem   (24px)
2xl:  2rem     (32px)
full: 9999px
```

## 🌟 Elevation (Shadows)

```css
none:  none
sm:    0 1px 2px 0 rgba(0, 0, 0, 0.05)
base:  0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)
md:    0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)
lg:    0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)
xl:    0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)
2xl:   0 25px 50px -12px rgba(0, 0, 0, 0.25)
inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)
```

## 📝 Typography

### Font Family
```css
Sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
Mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace
```

### Font Sizes
```css
xs:   0.75rem   (12px)
sm:   0.875rem  (14px)
base: 1rem      (16px)
lg:   1.125rem  (18px)
xl:   1.25rem   (20px)
2xl:  1.5rem    (24px)
3xl:  1.875rem  (30px)
4xl:  2.25rem   (36px)
5xl:  3rem      (48px)
```

### Font Weights
```css
normal:   400
medium:   500
semibold: 600
bold:     700
```

### Line Heights
```css
tight:   1.25
normal:  1.5
relaxed: 1.75
```

## 🎯 Component Classes

### Buttons
```html
<!-- Primary Button -->
<button class="btn-primary">Primary Action</button>

<!-- Secondary Button -->
<button class="btn-secondary">Secondary Action</button>

<!-- Accent Button -->
<button class="btn-accent">Accent Action</button>

<!-- Ghost Button -->
<button class="btn-ghost">Ghost Action</button>

<!-- Icon Button -->
<button class="btn-icon">
  <Icon />
</button>
```

### Cards
```html
<!-- Basic Card -->
<div class="card">Content</div>

<!-- Elevated Card -->
<div class="card-elevated">Content</div>
```

### Inputs
```html
<!-- Text Input -->
<input type="text" class="input" placeholder="Enter text" />
```

### Badges
```html
<!-- Status Badges -->
<span class="badge-primary">Primary</span>
<span class="badge-success">Success</span>
<span class="badge-warning">Warning</span>
<span class="badge-danger">Danger</span>
<span class="badge-accent">Accent</span>
```

### Navigation Links
```html
<!-- Active Navigation Link -->
<a class="nav-link-active">Dashboard</a>

<!-- Inactive Navigation Link -->
<a class="nav-link-inactive">Settings</a>
```

## ♿ Accessibility Guidelines

### Color Contrast
All text colors meet WCAG AA standards:
- Normal text: 4.5:1 contrast ratio minimum
- Large text: 3:1 contrast ratio minimum
- UI components: 3:1 contrast ratio minimum

### Tap Targets
Minimum tap target size: **44px × 44px**

All interactive elements (buttons, links, inputs) meet this minimum size for accessibility.

### Focus Styles
All interactive elements have visible focus indicators:
```css
*:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Tab order follows visual flow
- Focus is clearly visible
- Enter/Space activates buttons and links

## 📱 Responsive Breakpoints

```css
xs:  475px
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

## 🔧 Layout Specifications

### Topbar
- Height: 64px
- Position: Fixed top
- Background: White
- Shadow: elevation-sm

### Sidebar
- Width (expanded): 256px
- Width (collapsed): 80px
- Position: Fixed left
- Background: White

### Bottom Navigation (Mobile)
- Height: 64px
- Position: Fixed bottom
- Background: White
- Shadow: elevation-lg
- Visible: < 1024px only

### Content Area
- Max width: 1280px (7xl)
- Padding: 
  - Mobile: 16px
  - Tablet: 24px
  - Desktop: 32px

## 🎨 Usage Examples

### Using Design Tokens in Components

```jsx
// Using Tailwind classes (recommended)
<button className="btn-primary">
  Click Me
</button>

// Using CSS variables
<div style={{
  backgroundColor: 'var(--color-bg-elevated)',
  padding: 'var(--spacing-md)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)'
}}>
  Content
</div>

// Using design tokens in JavaScript
import { designTokens } from './styles/designTokens'

const styles = {
  color: designTokens.colors.primary[600],
  fontSize: designTokens.typography.fontSize.lg,
}
```

## 🚀 Implementation

The design system is implemented through:

1. **CSS Variables** (`src/styles/globals.css`)
2. **Tailwind Configuration** (`tailwind.config.js`)
3. **Design Tokens** (`src/styles/designTokens.js`)
4. **Utility Classes** (defined in `globals.css`)

## 📚 Best Practices

1. **Use semantic color names**: Use `primary`, `success`, `danger` instead of color values
2. **Use spacing scale**: Use predefined spacing values instead of arbitrary values
3. **Use utility classes**: Leverage pre-defined classes for consistency
4. **Maintain accessibility**: Always check color contrast and tap target sizes
5. **Keep it consistent**: Follow the design system across all components

---

**Questions or suggestions?** See `src/styles/designTokens.js` for the complete token reference.



