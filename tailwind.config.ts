import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

// ── Text size CSS variable keys ─────────────────────────────────
const textSizes = {
  "display-3xl": "--text-display-3xl",
  "display-2xl": "--text-display-2xl",
  "display-xl": "--text-display-xl",
  "display-lg": "--text-display-lg",
  "display-md": "--text-display-md",
  "display-sm": "--text-display-sm",
  "display-xs": "--text-display-xs",
  "text-xl": "--text-xl",
  "text-lg": "--text-lg",
  "text-md": "--text-md",
  "text-sm": "--text-sm",
  "text-xs": "--text-xs",
};

// ── Font weight CSS variable keys ───────────────────────────────
const fontWeights = {
  regular: "--font-weight-regular",
  medium: "--font-weight-medium",
  semibold: "--font-weight-semibold",
  bold: "--font-weight-bold",
  extrabold: "--font-weight-extrabold",
};

// ── customTextPlugin ────────────────────────────────────────────
// Generates classes like: .text-lg-bold, .display-md-extrabold, etc.
// Requires --font-weight-* and --text-*--line-height vars in globals.css
const customTextPlugin = plugin(({ addUtilities }) => {
  const newUtilities: Record<string, Record<string, string>> = {};

  for (const [sizeName, sizeVar] of Object.entries(textSizes)) {
    for (const [weightName, weightVar] of Object.entries(fontWeights)) {
      newUtilities[`.${sizeName}-${weightName}`] = {
        fontSize: `var(${sizeVar})`,
        lineHeight: `var(${sizeVar}--line-height)`,
        fontWeight: `var(${weightVar})`,
      };
    }
  }

  addUtilities(newUtilities);
});

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
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
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
      },
    },
  },

  plugins: [customTextPlugin],
} satisfies Config;
