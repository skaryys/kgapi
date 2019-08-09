var webpack = require('webpack');
var Encore = require('@symfony/webpack-encore');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

Encore
    .setOutputPath('build/')
    .disableSingleRuntimeChunk()
    .setPublicPath("/build")
    .setManifestKeyPrefix("")
    .cleanupOutputBeforeBuild()
    .addEntry('app', './assets/js/main.js')
    .addPlugin(new BrowserSyncPlugin({proxy: "localhost/kgapi"})) //browsersync, uprav podle toho kde spouštíš projekt
    .disableSingleRuntimeChunk()
;

var config = Encore.getWebpackConfig();

module.exports = config;
