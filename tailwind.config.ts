import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        popoverEnter: "popoverEnter .15s ease-out",
        popoverExit: "popoverExit .15s ease-out",
      },
      keyframes: {
        popoverEnter: {
          "0%": { opacity: "0", transform: "scale(.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        popoverExit: {
          "0%": { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(.9)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
