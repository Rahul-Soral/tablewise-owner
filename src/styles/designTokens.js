/**
 * Design Tokens
 * Centralized design system tokens for the Owner Portal
 * Defines colors, spacing, typography, shadows, and other design primitives
 */

export const designTokens = {
  // Color Palette - Modern warm neutrals with vibrant accents
  colors: {
    // Warm neutral backgrounds
    background: {
      primary: '#FAFAF9',      // Warm off-white
      secondary: '#F5F5F4',    // Light warm gray
      tertiary: '#E7E5E4',     // Medium warm gray
      elevated: '#FFFFFF',     // Pure white for cards
    },
    
    // Deep primary - Indigo/Teal blend
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',           // Main primary
      600: '#2563EB',           // Primary hover
      700: '#1E40AF',
      800: '#1E3A8A',
      900: '#1E293B',
    },
    
    // Teal accent for alternative actions
    teal: {
      50: '#F0FDFA',
      100: '#CCFBF1',
      200: '#99F6E4',
      300: '#5EEAD4',
      400: '#2DD4BF',
      500: '#14B8A6',           // Main teal
      600: '#0D9488',
      700: '#0F766E',
      800: '#115E59',
      900: '#134E4A',
    },
    
    // Orange accent for highlights and CTAs
    accent: {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316',           // Main accent
      600: '#EA580C',           // Accent hover
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
    },
    
    // Success - Green
    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',           // Main success
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    
    // Danger - Red
    danger: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',           // Main danger
      600: '#DC2626',           // Danger hover
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
    
    // Warning - Amber
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',           // Main warning
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    
    // Muted text colors
    text: {
      primary: '#1C1917',       // Almost black
      secondary: '#57534E',     // Medium gray
      tertiary: '#78716C',      // Light gray
      disabled: '#A8A29E',      // Very light gray
      inverse: '#FAFAF9',       // Light for dark backgrounds
    },
    
    // Border colors
    border: {
      light: '#E7E5E4',         // Light border
      medium: '#D6D3D1',        // Medium border
      dark: '#A8A29E',          // Dark border
      focus: '#3B82F6',         // Focus ring
    },
    
    // Status colors
    status: {
      online: '#22C55E',        // Green
      offline: '#78716C',       // Gray
      busy: '#EF4444',          // Red
      away: '#F59E0B',          // Amber
    },
  },
  
  // Spacing scale (matches Tailwind)
  spacing: {
    0: '0',
    1: '0.25rem',      // 4px
    2: '0.5rem',       // 8px
    3: '0.75rem',      // 12px
    4: '1rem',         // 16px
    5: '1.25rem',      // 20px
    6: '1.5rem',       // 24px
    8: '2rem',         // 32px
    10: '2.5rem',      // 40px
    12: '3rem',        // 48px
    16: '4rem',        // 64px
    20: '5rem',        // 80px
    24: '6rem',        // 96px
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',     // 4px
    base: '0.5rem',    // 8px
    md: '0.75rem',     // 12px
    lg: '1rem',        // 16px
    xl: '1.5rem',      // 24px
    '2xl': '2rem',     // 32px
    full: '9999px',
  },
  
  // Elevation (box shadows)
  elevation: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    overlay: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  
  // Transitions
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slowest: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Accessibility - Minimum tap target size
  minTapTarget: '44px',
  
  // Breakpoints (matches Tailwind)
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
}

export default designTokens



