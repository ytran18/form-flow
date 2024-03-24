const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "bundle.js",
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            "@pages": path.resolve(__dirname, "src", "pages"),
            "@core": path.resolve(__dirname, "src", "core"),
            "@components": path.resolve(__dirname, "src", "components"),
            "@images": path.resolve(__dirname, "src", "assets", "images"),
            "@icon": path.resolve(__dirname, "src", "assets", "icons"),
            "@utils": path.resolve(__dirname, "src", "utils"),
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src'),
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                  {
                    loader: 'file-loader',
                  },
                ],
            },
        ]
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        port: 5000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        })
    ]
};