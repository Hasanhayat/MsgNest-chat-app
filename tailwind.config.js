import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        default: {
          primary: "#ffffff", // White for primary text
          secondary: "#f0f0f0", // Light gray for secondary elements
          accent: "#ff4081", // Pink accent color
          neutral: "#000000", // Black for neutral elements
          "base-100": "#000000", // Base color for backgrounds
          "base-200": "#1a1a1a", // Dark gray for secondary backgrounds
          "base-300": "#333333", // Medium gray for borders or dividers
          info: "#2196f3", // Blue for informational messages
          success: "#4caf50", // Green for success messages
          warning: "#ff9800", // Orange for warnings
          error: "#f44336", // Red for error messages
      
          // Additional colors
          "base-400": "#4d4d4d", // Darker gray for deeper backgrounds
          "base-500": "#666666", // Gray for disabled elements
          "base-600": "#808080", // Light gray for subtle backgrounds
          "highlight": "#ffeb3b", // Yellow for highlights
          "shadow": "#000000", // Black for shadows
          "overlay": "rgba(0, 0, 0, 0.7)", // Semi-transparent black for overlays
          "link": "#2196f3", // Blue for links
          "border": "#444444", // Dark gray for borders
          "card": "#2a2a2a", // Darker background for cards
          "button-hover": "#ff4081", // Pink for button hover effects
          "button-active": "#e91e63", // Darker pink for active buttons
          "disabled": "#555555", // Gray for disabled elements
        },
      },
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  },
};
