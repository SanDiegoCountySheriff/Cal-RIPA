const path = require('path')

module.exports = async ({ config }) => {
  config.resolve.alias['~storybook'] = path.resolve(__dirname)

  config.resolve.alias['@'] = path.resolve(__dirname, '..', 'src')

  config.resolve.extensions.push(
    '.vue',
    '.css',
    '.less',
    '.scss',
    '.sass',
    '.html',
    '.svg',
  )

  config.module.rules.push({
    test: /\.scss$/,
    use: [
      require.resolve('vue-style-loader'),
      require.resolve('css-loader'),
      require.resolve('sass-loader'),
    ],
  })

  config.module.rules.push({
    test: /\.css$/,
    loaders: [
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          config: {
            path: './.storybook/',
          },
        },
      },
    ],

    include: path.resolve(__dirname, '../storybook/'),
  })

  return config
}
