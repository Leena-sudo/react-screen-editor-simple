module.exports = {
  parser: '@typescript-eslint/parser',
  root: true,
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
  plugins: ['@typescript-eslint'],
  extends: ['plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {},
      {
        usePrettierrc: true,
      },
    ],
    'filenames/match-regex': 'off',
    'no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        caughtErrors: 'none',
      },
    ],
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'security/detect-object-injection': 'off',
    'simple-import-sort/imports': 'off',
    'no-shadow': 'off',
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
      },
    },
  ],
};
