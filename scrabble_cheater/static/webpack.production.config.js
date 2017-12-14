const webpack = require('webpack')

const config = {
    entry:  __dirname + '/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
      rules: [{
        test: /\.js?/,
        exclude: /node_modules/,
        use: 'babel-loader?presets[]=es2015,presets[]=stage-0'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};

module.exports = config;