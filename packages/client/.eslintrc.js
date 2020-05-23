module.exports = {
  root: true,
  extends: [require.resolve('eslint-config-internal')],
  env: {
    browser: true,
    node: true,
    serviceworker: true,
  },
}
