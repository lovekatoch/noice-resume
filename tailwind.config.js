/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F5F7',
        'canvas-soft': '#FAFAFA',
        surface: '#FFFFFF',
        fg: '#1D1D1F',
        body: '#4A4A52',
        muted: '#86868B',
        'muted-subtle': '#A1A1A6',
        border: 'rgba(0,0,0,0.06)',
        accent: {
          DEFAULT: '#1E3A5F',
          hover: '#264B78',
          light: 'rgba(30,58,95,0.08)',
        },
        success: '#27A644',
        error: '#DC2626',
      },
      fontFamily: {
        display: ['var(--font-garamond)', 'Times New Roman', 'serif'],
        body: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(50,50,93,0.08), 0 2px 6px rgba(50,50,93,0.06)',
        lifted: '0 4px 12px rgba(50,50,93,0.10), 0 1px 3px rgba(50,50,93,0.06)',
        cta: 'rgba(30,58,95,0.30) 0px 8px 24px -4px',
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
