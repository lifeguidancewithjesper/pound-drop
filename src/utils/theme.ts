// Theme configuration for Pound Drop mobile app
// Beautiful purple/violet color palette for modern look

export const colors = {
  // Primary purple/violet palette
  primary: '#8B5CF6',        // Beautiful violet (HSL 261, 83%, 66%)
  primary600: '#7C3AED',     // Darker violet for emphasis (HSL 263, 85%, 67%)
  primary700: '#6D28D9',     // Darkest violet for strong emphasis (HSL 265, 85%, 60%)
  secondary: '#A855F7',      // Secondary purple (HSL 283, 89%, 66%)
  accent: '#EC4899',         // Pink accent color (HSL 332, 82%, 60%)
  
  // Status colors (keeping existing)
  success: '#10B981',        // Green
  warning: '#F59E0B',        // Amber
  error: '#EF4444',          // Red
  info: '#3B82F6',           // Blue
  
  // Neutral colors
  textPrimary: '#1F2937',    // Dark gray for primary text
  textSecondary: '#4B5563',  // Medium gray for secondary text
  textTertiary: '#6B7280',   // Light gray for tertiary text
  surface: '#FFFFFF',        // White background
  surfaceMuted: '#F9FAFB',   // Light gray background
  border: '#E5E7EB',         // Border color
  
  // Activity indicator and loading states
  loading: '#8B5CF6',        // Use primary violet for loading indicators
  
  // Button states
  buttonPrimary: '#8B5CF6',
  buttonSecondary: '#A855F7',
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