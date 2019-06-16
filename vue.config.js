module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  chainWebpack: config => {

    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // Or array of paths
          resources: ['./src/assets/mixins/theme_default.scss', './src/assets/mixins/_animation.scss']
        })
        .end()
    })
  }
}