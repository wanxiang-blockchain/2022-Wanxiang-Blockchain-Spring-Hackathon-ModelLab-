module.exports = {
  outputDir: 'dist',
  //跨域代理
  devServer: {
    proxy: "http://127.0.0.1:8080/"
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/antV-X6-demo/'
    : '/'
}
