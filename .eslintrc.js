module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: 'netguru-ember',
  env: {
    'browser': true
  },
  rules: {
    'netguru-ember/order-in-components': 0,
    'netguru-ember/no-observers': 1,
    'one-var': ['error', {'var': 'always', 'let': 'always', 'const': 'always'}],
    'keyword-spacing': ['error', {
      'overrides': {
        'if': {'before': false, 'after': false},
        'for': {'before': false, 'after': false},
        'switch': {'before': false, 'after': false}
      }
    }],
    'brace-style': ['error', 'stroustrup']
  }
};
