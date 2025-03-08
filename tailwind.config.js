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
          // General colors
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
      
          // Chat bubble colors
          "chat-bubble-neutral": "#1a1a1a", // Neutral color for chat bubble
          "chat-bubble-primary": "#ff4081", // Primary color for chat bubble (sent messages)
          "chat-bubble-secondary": "#2a2a2a", // Secondary color for chat bubble (received messages)
          "chat-bubble-accent": "#ff4081", // Accent color for chat bubble (highlighted messages)
          "chat-bubble-info": "#2196f3", // Info color for chat bubble (informational messages)
          "chat-bubble-success": "#4caf50", // Success color for chat bubble (successful actions)
          "chat-bubble-warning": "#ff9800", // Warning color for chat bubble (warnings)
          "chat-bubble-error": "#f44336", // Error color for chat bubble (error messages)
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
