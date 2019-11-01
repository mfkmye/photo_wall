var path = require('path');
var {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
var HtmlWebpack = require('html-webpack-plugin');
var WebPack = require('webpack');
var WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default;
var glob = require('glob-all');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var PurifyCSSPlugin = require('purifycss-webpack');
module.exports = {
    entry: {
        baobao: './src/js/baobao.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name][hash:5].bundle.js'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: "all",
                    // 被抽离文件最小单位(kb)
                    minSize: 1,
                    // 最少出现次数
                    minChunks: 2
                },
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: "all",
                    // 被抽离文件最小单位(kb)
                    minSize: 1,
                    // 最少出现次数
                    minChunks: 2
                }
            }
        }
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: 'css-loader'
            }]
        }, {
            test: /\.less$/,
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: 'css-loader'
            }, {
                loader: 'postcss-loader',
                options: {
                    ident: 'postcss',
                    plugins: [
                        // 解析css4的语法并自动添加前缀
                        // require('postcss-cssnext'),
                        // 自动添加前缀,postcss-cssnext 已经支持该插件
                        require('autoprefixer'),
                        // 压缩
                        require('cssnano')
                    ]
                }
            }, {
                loader: 'less-loader'
            }]
        }, {
            // 图片抽取，压缩，打包
            test: /\.(jpg||png||jpeg||gif||webp||bmp)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    name: '[name][hash:5].[ext]',
                    // 限制图片大小 <= 100KB 进行base64编码
                    limit: 1000, // 抽取图片
                    // limit: 100000, // 抽取编码
                    outputPath: 'img'
                }
            }, {
                loader: 'img-loader',
                options: {
                    plugins: [
                        require('imagemin-gifsicle')({
                            interlaced: false
                        }),
                        require('imagemin-mozjpeg')({
                            progressive: true,
                            arithmetic: false
                        }),
                        require('imagemin-pngquant')({
                            quality: [0.3, 0.5]
                        }),
                        require('imagemin-svgo')({
                            plugins: [{
                                removeTitle: true
                            }, {
                                convertPathData: false
                            }]
                        })
                    ]
                }
            }]
        }, {
            // 将html里的img标签里src换成打包后的文件
            test: /\.html$/,
            use: [{
                loader: 'html-loader',
                options: {
                    attrs: ['img:src']
                }
            }]
        }]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // new HtmlWebpack(),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync([
                path.join(__dirname, './*.html'),
                path.join(__dirname, './src/*.js')
            ]),
        }),
        new MiniCssExtractPlugin({
            filename: '[name][hash:5].css'
        }),
        new HtmlWebpack({
            filename: 'baobao.html',
            template: 'baobao.html',
            chunks: ["common", "baobao"]
        }),
        new WebpackDeepScopeAnalysisPlugin(),
        new WebPack.HotModuleReplacementPlugin(),
    ],
    mode: 'development',
    devServer: {
        // 端口
        port: '9091',
        // 默认路径
        contentBase: "./dist",
        hot: true,
        index: 'baobao.html'
    },
}