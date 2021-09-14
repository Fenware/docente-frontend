module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: {
         'height': 'height',
         'spacing': 'margin, padding',
        }
    },
  },
  variants: {
    extend: {
      width:['focus'],
      height:['focus'],
      transitionProperty: ['hover', 'focus'],
    },
  },
  plugins: [],
}
