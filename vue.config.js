//const { defineConfig } = require('@vue/cli-service')
/* module.exports = defineConfig({

}) */


module.exports = {
  transpileDependencies: true,
  lintOnSave:false,
  publicPath: './',
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9001/', // 本地后端地址
        // target: 'http://101.132.181.9:3000/', // 线上后端地址
        changeOrigin: true, //允许跨域
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
