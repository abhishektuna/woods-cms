import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#eb8b1d",
        secondary: "#b5ce07",
        background: "#f4f7f0",
      },
    },
  },
};

export default config;
