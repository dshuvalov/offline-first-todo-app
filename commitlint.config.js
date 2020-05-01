module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'scope-enum': [2, 'always', ['app', 'client', 'server', 'eslint-config-internal']],
  },
}
