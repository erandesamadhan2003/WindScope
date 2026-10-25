import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        navy: {
          950: "#0B1121",
          900: "#111827",
          800: "#1C2B3A",
          700: "#1E3A5F",
          600: "#243044",
        },
        wind: {
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0369A1",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
