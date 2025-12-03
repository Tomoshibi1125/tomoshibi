/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        systemBg: "#05080f",
        systemAccent: "#2ee4ff",
        systemAccentSoft: "#6ac9ff",
        systemDanger: "#ff3b6b"
      }
    }
  },
  plugins: []
};

export default config;
