module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/standard', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'array-callback-return': 'warn',
    eqeqeq: 'warn',
    'import/no-duplicates': 'warn',
    'import/no-extraneous-dependencies': 'off', // always ignore warning or error
    'import/no-named-default': 'warn',
    'import/no-webpack-loader-syntax': 'off', // always ignore warning or error
    'linebreak-style': ['off', 'unix'], // always ignore warning or error
    'no-console': 'off', // always ignore warning or error
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-dupe-keys': 'warn',
    'no-labels': 'off', // always ignore warning or error
    'no-prototype-builtins': 'warn',
    'no-return-await': 'warn',
    'no-sequences': 'off', // always ignore warning or error
    'no-throw-literal': 'off', // always ignore warning or error
    'no-undef': 'warn',
    'no-unreachable': 'warn',
    'no-unused-expressions': 'warn',
    'no-unused-vars': 'warn',
    'no-var': 'warn',
    'prettier/prettier': [
      'warn',
      {
        htmlWhitespaceSensitivity: 'strict',
        semi: false,
        singleQuote: true,
      },
    ],
    'quote-props': ['warn', 'as-needed'],
    'vue/experimental-script-setup-vars': 'off',
    'vue/no-dupe-keys': 'warn',
    'vue/no-mutating-props': 'off', // always ignore warning or error
    'vue/no-side-effects-in-computed-properties': 'warn',
    'vue/no-unused-components': 'warn',
    'vue/no-unused-vars': 'warn',
    'vue/require-component-is': 'warn',
    'vue/require-v-for-key': 'warn',
    'vue/return-in-computed-property': 'warn',
    'vue/valid-v-for': 'warn',
    'vue/valid-v-slot': 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
}
