// tailwind.config.mjs

/** @type {import('tailwindcss').Config} */
const config = {
  // Add this safelist to solve the react-live issue
  safelist: [
    {
      pattern: /^(bg|text|border|ring)-(red|green|blue|yellow|purple|gray|indigo|pink|white|black)-(100|200|300|400|500|600|700|800|900)$/,
    },
    {
      pattern: /^(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml)-[0-9]+$/,
    },
    {
      pattern: /^(w|h)-(full|screen|[0-9/]+)$/,
    },
    {
      pattern: /^(flex|grid|items|justify|gap|rounded)-.+$/,
    },
  ],

  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // You can also add fontFamily if you want to use your CSS vars
      fontFamily: {
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },
    },
  },
  plugins: [],
};

export default config;