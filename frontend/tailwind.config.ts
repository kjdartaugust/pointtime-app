import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: "#0a0a0b",
        // Figma-style vibrant accents, used sparingly
        grape: { DEFAULT: "#7C3AED", soft: "#f1e9ff" },
        lime: { DEFAULT: "#A3E635", soft: "#f2fbe0" },
        gold: { DEFAULT: "#F59E0B", soft: "#fef3da" },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(0,0,0,0.12)",
        card: "0 4px 24px -6px rgba(0,0,0,0.10)",
        lift: "0 24px 60px -16px rgba(0,0,0,0.22)",
        glow: "0 0 0 1px rgba(124,58,237,0.15), 0 20px 50px -12px rgba(124,58,237,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-22px) rotate(6deg)" },
        },
        blob: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(40px,-30px) scale(1.1)" },
          "66%": { transform: "translate(-30px,25px) scale(0.95)" },
        },
        gradient: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 9s ease-in-out infinite",
        "float-slow": "float 14s ease-in-out infinite",
        blob: "blob 18s ease-in-out infinite",
        gradient: "gradient 8s ease infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
