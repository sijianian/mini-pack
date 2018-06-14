module.exports = {
  root: true,
  extends: 'standard',
  rules: {
    'comma-dangle': [
      'error',
      {
        arrays: 'never',
        objects: 'always',
        imports: 'never',
        exports: 'never',
        functions: 'ignore',
      },
    ],
  },
}
