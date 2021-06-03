module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-knobs',
    '@storybook/addon-viewport',
    '@storybook/addon-actions',
    '@storybook/addon-a11y',
    '@storybook/addon-postcss',
  ],
}
