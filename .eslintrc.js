module.exports = {
  'extends': 'airbnb-base',

  /**
   * Tell eslint that code will run in browser. Otherwise, eslint will report
   * that XMLHttpRequest is undefined, because XMLHttpRequest is only standard in browsers
   */
  'env': {
    'browser': 1,
  },

  // List global variables to prevent eslint from reporting them as undefined
  'globals': {
    'API_URL': 1,
  },

  // html is required to lint *.vue files
  'plugins': [
    'import',
    'html',
  ],
};
