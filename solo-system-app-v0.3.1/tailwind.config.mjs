/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        systemBg: "#05080f",
        systemAccent: "#2ee4ff",
        systemAccentSoft: "#7ef2ff",
        systemDanger: "#ff3370",
        systemShadow: "#7b3cff"
      },
      fontFamily: {
        sans: ["system-ui", "SF Pro Text", "Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};
