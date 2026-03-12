import type { Config } from "tailwindcss";
const { heroui } = require("@heroui/react");
const { fontFamily } = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "src/app/**/*.{ts,tsx}",
    "src/components/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
        screens: {
          sm: "37.5rem", // 600px
          md: "45.5rem", // 728px
          lg: "61.5rem", // 984px
          xl: "77.5rem", // 1240px
          "2xl": "78rem", // 1352px
        },
      },
      fontFamily: {
        roboto: ["var(--font-roboto)", "sans-serif"],
        sans: ["Inter", ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: "#323E61",
          "50": "#F2F3F7",
          "100": "#DEE2ED",
          "200": "#C0C7DA",
          "300": "#96A2BF",
          "400": "#68789F",
          "500": "#485981",
          "600": "#323F61",
          "700": "#2A3552",
          "800": "#232C42",
          "900": "#1E2336",
          "950": "#10141E",
        },
        danger: {
          DEFAULT: "#ef4444",
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
      },
      borderRadius: {
        "4xl": "32px",
      },
      boxShadow: {
        "3xl":
          "0 3px 12px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [
    heroui({
      layout: {
        fontSize: {
          tiny: "0.875rem",
          small: "1rem",
          medium: "1.125rem",
          large: "1.25rem",
          DEFAULT: "1.125rem",
        },
        lineHeight: {
          tiny: "1.25rem",
          small: "1.5rem",
          medium: "1.75rem",
          large: "1.75rem",
          DEFAULT: "1.75rem",
        },
        disabledOpacity: "0.3", // opacity-[0.3]
        radius: {
          small: "2px", // rounded-small
          medium: "4px", // rounded-medium
          large: "6px", // rounded-large
        },
        borderWidth: {
          small: "1px", // border-small
          medium: "1px", // border-medium
          large: "2px", // border-large
        },
      },
    }),
    require("@tailwindcss/typography"),
    require("tailwindcss-react-aria-components"),
  ],
  darkMode: "class",
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config;
