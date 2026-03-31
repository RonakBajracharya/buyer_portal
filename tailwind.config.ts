import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        ink: "#0f0e0c",
        cream: "#f5f0e8",
        gold: "#c9a84c",
        stone: "#9e9589",
      },
    },
  },
  plugins: [],
};

export default config;
