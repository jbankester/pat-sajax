module.exports = {
    entry: './src/index.js',
    output:{
        library: 'pat-sajax',
        libraryTarget: 'umd',
        path: './dist',
        filename: 'pat-sajax.js'
    },
    module:{
        loaders:[
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query:{
                    presets: ['es2015']
                }
            }
        ]
    }
}

/*
    plugins: [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ],*/