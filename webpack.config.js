var webpack = require('webpack')

module.exports = {
  'entry': ['babel-polyfill', 'whatwg-fetch', './public/src/js/app'],
  'output': {
    path: __dirname + '/public/bin',
    filename: 'bundle.js'
  },
  'resolve': {
    'extensions': ['', '.webpack.js', '.web.js', '.tag', '.js'],
    'modulesDirectories': ['web_modules', 'node_modules']
  },
  'plugins': [
    new webpack.ProvidePlugin({
      'oval': 'organic-oval'
    })
  ],
  'module': {
    'preLoaders': [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          // turned off due to a weird syntax error when parsing
          //'organic-oval/webpack/oval-loader',
          'organic-oval/webpack/oval-control-statements-loader'
        ]
      }
    ],
    'loaders': [
      {
        test: /\.js$|\.tag$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: [
            ['transform-react-jsx', { pragma: 'createElement' }]
          ],
          presets: ['es2015']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
}