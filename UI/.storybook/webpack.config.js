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
    test: /\.sass$/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'sass-loader',
        options: {
          sassOptions: {
            indentedSyntax: true,
          },
          prependData: "@import '@/sass/variables.sass'",
        },
      },
    ],
    include: path.resolve(__dirname, '../'),
  })

  return config
}
