import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans TC",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,.12), 0 18px 60px rgba(0,0,0,.36)",
        card: "0 22px 70px rgba(2,6,23,.36)"
      }
    }
  },
  plugins: []
};

export default config;
