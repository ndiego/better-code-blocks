const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
    ...defaultConfig,
    entry: {
        editor: './src/editor.js',
        index: './src/index.js',
    },
    // Ensure we keep the default style handling from @wordpress/scripts.
    output: {
        ...defaultConfig.output,
        filename: '[name].js',
    }
}; 