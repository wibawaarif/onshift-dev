/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      gridTemplateColumns: {
        '25': 'repeat(30, minmax(0px, 1fr))',
        '30': 'repeat(30, minmax(0px, 1fr))',
        '38': 'repeat(38, minmax(0px, 1fr))',
        '39': 'repeat(39, minmax(0px, 1fr))',
      },
      gridColumn: {
        'span-24': 'span 24 / span 24',
        'span-25': 'span 25 / span 25'
      },
      gridColumnStart: {
        '37': '37',
        '38': '38',
      }
    },
  },
  plugins: [
  ],
}
