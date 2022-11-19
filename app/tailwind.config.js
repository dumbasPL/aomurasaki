/* eslint-env node */
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({strategy: 'class'}),
    function ({ matchUtilities, theme }) {
      matchUtilities(
        { highlight: (value) => ({ boxShadow: `inset 0 1px 0 0 ${value}` }) },
        { values: flattenColorPalette(theme('backgroundColor')), type: 'color' }
      )
    },
  ],
}
