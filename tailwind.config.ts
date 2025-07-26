
import type { Config } from "tailwindcss";
import { typographyTokens } from "./src/design-system/tokens/typography";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Design system font families
      fontFamily: {
        rare: typographyTokens.fontFamily.rare,
        ui: typographyTokens.fontFamily.ui,
        body: typographyTokens.fontFamily.body,
        mono: typographyTokens.fontFamily.mono,
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(var(--primary-50))",
          100: "hsl(var(--primary-100))",
          600: "hsl(var(--primary-600))",
          700: "hsl(var(--primary-700))",
          900: "hsl(var(--primary-900))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "hsl(var(--secondary-50))",
          100: "hsl(var(--secondary-100))",
          600: "hsl(var(--secondary-600))",
          700: "hsl(var(--secondary-700))",
          900: "hsl(var(--secondary-900))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Design system semantic colors
        success: {
          50: "hsl(142, 50%, 96%)",
          100: "hsl(142, 45%, 92%)",
          500: "hsl(142, 30%, 45%)",
          600: "hsl(142, 32%, 38%)",
          900: "hsl(142, 42%, 12%)",
        },
        warning: {
          50: "hsl(48, 65%, 96%)",
          100: "hsl(48, 60%, 92%)",
          500: "hsl(48, 45%, 50%)",
          600: "hsl(48, 48%, 42%)",
          900: "hsl(48, 60%, 15%)",
        },
        error: {
          50: "hsl(0, 55%, 96%)",
          100: "hsl(0, 50%, 92%)",
          500: "hsl(0, 40%, 50%)",
          600: "hsl(0, 42%, 42%)",
          900: "hsl(0, 52%, 15%)",
        },
        info: {
          50: "hsl(214, 60%, 96%)",
          100: "hsl(214, 55%, 92%)",
          500: "hsl(214, 40%, 50%)",
          600: "hsl(214, 42%, 42%)",
          900: "hsl(214, 52%, 15%)",
        },
        neutral: {
          50: "hsl(210, 20%, 98%)",
          100: "hsl(210, 15%, 95%)",
          200: "hsl(210, 12%, 88%)",
          300: "hsl(210, 10%, 78%)",
          400: "hsl(210, 8%, 62%)",
          500: "hsl(210, 6%, 45%)",
          600: "hsl(210, 8%, 35%)",
          700: "hsl(210, 10%, 25%)",
          800: "hsl(210, 12%, 15%)",
          900: "hsl(210, 15%, 8%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
