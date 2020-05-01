const path = require('path')

module.exports = {
  extends: [require.resolve(path.join(process.cwd(), 'packages/eslint-config-internal/index'))],
}
