/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      'dot-black': "url('data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3e%3ccircle fill='rgb(0 0 0 / 0.2)' id='pattern-circle' cx='10' cy='10' r='1.6257413380501518'%3e%3c/circle%3e%3c/svg%3e')",
    },
  },
  screens: {
    xs: "480px",
    sm: "768px",
    md: "1060px",
  },
  plugins: [],
}

