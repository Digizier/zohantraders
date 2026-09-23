import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zohan: {
          red: "#E8001D",
          "red-dark": "#B80017",
          "red-light": "#FFF1F2",
          dark: "#0F172A",
          darker: "#0B1120",
          navy: "#1E293B",
          gold: "#F59E0B",
          "gold-light": "#FEF3C7",
          slate: "#334155",
          muted: "#64748B",
          border: "#E2E8F0",
          bg: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
