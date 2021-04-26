module.exports = {
  transpileDependencies: ['vuetify'],

  publicPath: './',

  pwa: {
    name: 'Ripa Stop App',
    themeColor: '#42b983',
    msTileColor: '#42b983',
    appleMobileWebAppCache: 'yes',
    appleMobileWebAppStatusBarStyle: '#42b983',
    manifestOptions: {
      background_color: '#42b983',
    },
    workboxOptions: {
      navigateFallback: '/index.html',
    },
  },
}
