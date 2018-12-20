module.exports = {
  baseUrl: './',
  devServer: {
    port: 8080,
    proxy: {
      '/api/*': {
        target: 'http://10.0.0.11',
        changeOrigin: true
      },
      '/cdn': {
        target: 'http://10.0.0.11/cdn',
        changeOrigin: true,
        pathRewrite: {
          '^/cdn': '/'
        }
      }
    }
  },
  runtimeCompiler: true,
  css: { extract: false }
}