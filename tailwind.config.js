/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
    screens: {
      phone: { max: "767px" },
      tablet: { min: "768px", max: "1023px" },
      laptop: { min: "1024px", max: "1580px" },
      desktop: { min: "1581px" },
      md: { min: "768px" },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      // EmpowerHer Colors
      primary: {
        DEFAULT: "#132880", // Dark blue
        foreground: "#FFFFFF",
      },
      Secondary: {
        DEFAULT: "#2685f0", // Blue
        foreground: "#FFFFFF",
      },
      Accent: {
        DEFAULT: "#65acf0", // Light blue
        foreground: "#FFFFFF",
      },
      Muted: {
        DEFAULT: "#a7dcf0", // Baby blue
        foreground: "#FFFFFF",
      },


      white: "#FFFFFF",
      black: "#000000",
      gray: {
        100: "#F5F5F5",
        200: "#eee",
        300: "#D9D9D9",
        600: "#575757",
      },
      red: {
        100: "#fee2e2",
        200: "#fecaca",
        300: "#fca5a5",
        400: "#f87171",
        500: "#ef4444",
        600: "#dc2626",
        700: "#b91c1c",
        800: "#991b1b",
        900: "#7f1d1d",
      },
      green: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',  // Default `text-green-500`
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16',
      },
      yellow: {
        50: '#FFF9C4',  // Light Lemon  
        100: '#FFF176',  // Pastel Yellow  
        200: '#FFEE58',  // Banana Yellow  
        300: '#FFD600',  // Bright Citrus  
        400: '#FFC107',  // Golden Yellow  
        500: '#FFB300',  // Sunflower  
        600: '#E69A00',  // Mustard Yellow  
        700: '#D1A054',  // Ochre  
        800: '#B8860B',  // Deep Gold  
        900: '#8B6508',  // Burnt Yellow  
      },
      // DarkMode Colors
      dark: {
        primary: {
          100: "#3A3B3C",
          300: "#242526", // second
          600: "#18191A", // main dark
        },
        gray: {
          100: "#EBEEF4", // more white
          300: "#AFB2B7", // main for content
          600: "#737373", // dark
        },

      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};