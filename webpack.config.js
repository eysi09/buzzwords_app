var path = require('path');
var webpack = require('webpack');

var config = module.exports = {
  // the base path which will be used to resolve entry points
  context: __dirname,
  // the main entry point for our application's frontend JS
  entry: './app/frontend/javascripts/entry.js',
};

config.output = {
  // this is our app/assets/javascripts directory, which is part of the Sprockets pipeline
  path: path.join(__dirname, 'app', 'assets', 'javascripts'),
  // the filename of the compiled bundle, e.g. app/assets/javascripts/bundle.js
  filename: 'bundle.js',
  // if the webpack code-splitting feature is enabled, this is the path it'll use to download bundles
  publicPath: '/assets',
  // Now your 'virtual’ source files will appear under the domain > assets directory in the Sources tab.tab
  devtoolModuleFilenameTemplate: '[resourcePath]',
  devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]',
};

config.resolve = {
  // tell webpack which extensions to auto search when it resolves modules. With this,
  // you'll be able to do `require('./utils')` instead of `require('./utils.js')`
  extensions: ['', '.js', '.jsx'],
  // by default, webpack will search in `web_modules` and `node_modules`.
  modulesDirectories: [ 'node_modules' ],
};

config.plugins = [
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    "window.jQuery": "jquery"
  }),
  new webpack.ProvidePlugin({
    React: 'react'
  }) 
];

config.module = {
  loaders: [
    { test: /\.less$/, loader: 'style!css!less' }, // needs a look
    { test: /\.jsx?$/, loaders: ['jsx', 'babel'], exclude: /node_modules/ },
    { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
    { test: /\.json$/, loader: 'json' } // needs a look
  ]
}
