import type { Config } from "tailwindcss";
const config: Config = {
    "./src/pages*.{js,ts,jsx,tsx,mdx}",
    "./src/app*.{js,ts,jsx,tsx,mdx}",
  theme: {
      fontFamily: {
      },
        apple: {
          "blue-hover": "#0077ed",
          gray: "#6e6e73",
          border: "#d2d2d7",
        },
      backgroundImage: {
      },
        "fade-up": {
          "100%": { opacity: "1", transform: "translateY(0)" },
        "fade-in": {
          "100%": { opacity: "1" },
      },
        "fade-up": "fade-up 0.6s ease forwards",
      },
  },
};
export default config;
