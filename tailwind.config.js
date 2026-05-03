/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: '#FFFFFF',
        muted: '#6b7280',
        accent: {
          DEFAULT: '#5E6AD2',
          hover: '#4a56b8',
          light: 'rgba(94,106,210,0.1)',
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
      },
      boxShadow: {
        card: '0 1px 2px rgba(50,50,93,0.08), 0 2px 6px rgba(50,50,93,0.06)',
        lifted: '0 4px 12px rgba(50,50,93,0.1), 0 1px 3px rgba(50,50,93,0.06)',
      },
      backgroundImage: {
        dot: "url('/assets/dots.svg')",
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
