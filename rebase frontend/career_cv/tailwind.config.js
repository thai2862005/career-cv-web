export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Material Design 3 - Blue Theme
        'primary': '#3755c3',
        'on-primary': '#f8f7ff',
        'primary-container': '#dde1ff',
        'on-primary-container': '#2747b6',
        'primary-fixed': '#dde1ff',
        'primary-fixed-dim': '#cad2ff',
        'on-primary-fixed': '#0732a3',
        'on-primary-fixed-variant': '#3352c0',
        'primary-dim': '#2848b7',
        'inverse-primary': '#6d89fa',

        // Secondary
        'secondary': '#5f5e62',
        'on-secondary': '#fbf8fc',
        'secondary-container': '#e4e1e6',
        'on-secondary-container': '#525155',
        'secondary-fixed': '#e4e1e6',
        'secondary-fixed-dim': '#d6d3d8',
        'on-secondary-fixed': '#3f3f43',
        'on-secondary-fixed-variant': '#5c5b5f',
        'secondary-dim': '#535356',

        // Tertiary
        'tertiary': '#635b77',
        'on-tertiary': '#fdf7ff',
        'tertiary-container': '#e9ddff',
        'on-tertiary-container': '#564d69',
        'tertiary-fixed': '#e9ddff',
        'tertiary-fixed-dim': '#dbcff0',
        'on-tertiary-fixed': '#433b55',
        'on-tertiary-fixed-variant': '#605773',
        'tertiary-dim': '#574f6a',

        // Error
        'error': '#9e3f4e',
        'on-error': '#fff7f7',
        'error-container': '#ff8b9a',
        'on-error-container': '#782232',
        'error-dim': '#4f0116',

        // Neutral
        'outline': '#5d7da4',
        'outline-variant': '#94b4de',
        'surface': '#f8f9ff',
        'on-surface': '#0e3457',
        'on-surface-variant': '#416186',
        'inverse-surface': '#050f1a',
        'inverse-on-surface': '#939ead',

        // Surface colors
        'surface-dim': '#c3dcff',
        'surface-bright': '#f8f9ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eef4ff',
        'surface-container': '#e5eeff',
        'surface-container-high': '#dbe9ff',
        'surface-container-highest': '#d2e4ff',
        'surface-tint': '#3755c3',
        'surface-variant': '#d2e4ff',

        // Background
        'background': '#f8f9ff',
        'on-background': '#0e3457',
      },
      fontFamily: {
        'headline': ['Manrope', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'label': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'none': '0',
        'xs': '0.125rem',
        'sm': '0.25rem',
        'base': '0.5rem',
        'md': '0.75rem',
      },
      boxShadow: {
        'editorial': '0 24px 48px -12px rgba(14, 52, 87, 0.06)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
      },
      backdropBlur: {
        'glass': '12px',
      },
    },
  },
  plugins: [],
}
