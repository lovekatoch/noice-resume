/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: '#FFFFFF',
        muted: '#86868B',
        accent: {
          DEFAULT: '#1E3A5F',
          hover: '#162d4d',
          light: 'rgba(30,58,95,0.08)',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(50,50,93,0.08), 0 2px 6px rgba(50,50,93,0.06)',
        lifted: '0 4px 12px rgba(50,50,93,0.1), 0 1px 3px rgba(50,50,93,0.06)',
      },
      backgroundImage: {
        dot: "url('/assets/dots.svg')",
      },
      keyframes: {
        gradient: {
          "to": { backgroundPosition: "200% center" },
        },
      },
      animation: {
        gradient: "gradient 6s linear infinite",
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("@tailwindcss/aspect-ratio"),
  ],
};
