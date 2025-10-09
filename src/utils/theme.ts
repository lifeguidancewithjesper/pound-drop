// Theme configuration for Pound Drop mobile app
// Vibrant purple-to-pink gradient palette matching marketing website

export const colors = {
  // Primary gradient palette (matches website)
  primary: '#9333EA',        // Purple-600 for main brand
  primaryDark: '#7E22CE',    // Purple-700 for darker emphasis
  secondary: '#DB2777',      // Pink-600 for gradient accent
  accent: '#EC4899',         // Pink-500 for highlights
  
  // Green-Lime gradient (matches website branding)
  brandGreen: '#16A34A',     // Green-600
  brandLime: '#84CC16',      // Lime-500
  
  // Status colors (vibrant to match website)
  success: '#16A34A',        // Green-600
  warning: '#FACC15',        // Yellow-400
  error: '#EF4444',          // Red-500
  info: '#3B82F6',           // Blue-500
  
  // Neutral colors
  textPrimary: '#1F2937',    // Dark gray for primary text
  textSecondary: '#4B5563',  // Medium gray for secondary text
  textTertiary: '#6B7280',   // Light gray for tertiary text
  surface: '#FFFFFF',        // White background
  surfaceMuted: '#F9FAFB',   // Light gray background
  border: '#E5E7EB',         // Border color
  
  // Gradient backgrounds (matching website style)
  gradientPurplePink: ['#9333EA', '#DB2777'],  // Main brand gradient
  gradientGreenLime: ['#16A34A', '#84CC16'],   // Accent gradient
  
  // Activity indicator and loading states
  loading: '#9333EA',        // Use primary purple for loading
  
  // Button states
  buttonPrimary: '#9333EA',
  buttonSecondary: '#DB2777',
  buttonDisabled: '#9CA3AF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Export default theme object
const theme = {
  colors,
  spacing,
  borderRadius,
  fontSizes,
};

export default theme;