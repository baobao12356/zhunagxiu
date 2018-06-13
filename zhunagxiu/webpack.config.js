const webpack = require('webpack');

module.exports = (webpackConfig)=> {
  let retVal = Object.assign({}, webpackConfig, {
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      // 'antd-mobile': 'antd-mobile'
      // 提出ant design的公共资源
      //'antd': 'antd',
    },
    devServer: {
      hot: true,
      inline: true,
      port: 9000,
      stats: { colors: true, progress: false },
      compress: true,
      quiet: false,
      clientLogLevel: 'info',
      disableHostCheck:true,
      open: false,
      //host: '192.168.222.38',
      proxy: {
        '/api': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-bigdata': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-longyan': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-user': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-jiazhuang': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-coupon': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        },
        '/api-order': {
          changeOrigin: true,
          target: 'http://localhost:3000',
          secure: false
        }
      }
    }
  });
  if (webpackConfig.env === 'prd' && webpackConfig.env === 'stg') {
    retVal.plugins.forEach((plugin, index) => {
      if (plugin instanceof webpack.optimize.UglifyJsPlugin) {
        retVal.plugins[index] = new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true
          }
        });
      }
    });
  }
  const svgDirs = [
    require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
    // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 2. 自己私人的 svg 存放目录
  ];

  retVal.module.loaders.push({
    test: /\.(svg)$/i,
    loader: 'svg-sprite',
    include: svgDirs
  });
  retVal.babel.plugins.push(['import', { libraryName: 'antd-mobile', style: true }]);
  return retVal;
};
