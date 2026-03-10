const { merge } = require('webpack-merge'),
      commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
    devtool: 'source-map',
    mode: 'production',
    optimization: {
        emitOnErrors: true,
        splitChunks: {
            chunks: 'async',
            maxSize: 2 * 1024 * 1024,
            enforceSizeThreshold: 4 * 1024 * 1024,
            cacheGroups: {
                reactVendor: {
                    test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
                    name: 'vendors-react',
                    chunks: 'async',
                    priority: 20,
                },
                coreJs: {
                    test: /[\\/]node_modules[\\/]core-js[\\/]/,
                    chunks: 'async',
                    priority: 15,
                    maxSize: 2 * 1024 * 1024,
                },
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
            },
        },
    },
});
