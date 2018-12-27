module.exports = {
  baseUrl: './',
  devServer: {
    port: 8080,
    proxy: {
      '/api/*': {
        target: 'http://10.0.0.83',
        changeOrigin: true
      },
      '/cdn': {
        target: 'http://10.0.0.83/cdn',
        changeOrigin: true,
        pathRewrite: {
          '^/cdn': '/'
        }
      }
    }
  },
  runtimeCompiler: true,
  css: { extract: false },
  // configureWebpack: {
  //   externals: process.env.NODE_ENV === 'production'
  //     ? ['vue', 'vue-router', 'lodash']
  //     : [],
  // }
}