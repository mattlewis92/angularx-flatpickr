import * as webpack from 'webpack';
import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const isDevServer = process.argv.find(v => v.includes('webpack-dev-server'));

export default {
  mode: isDevServer ? 'development' : 'production',
  entry: path.join(__dirname, 'demo', 'entry.ts'),
  output: {
    filename: isDevServer ? '[name].js' : '[name]-[chunkhash].js',
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /node_modules\/@angular\/core\/.+\/core\.js$/,
        parser: {
          system: true // disable `System.import() is deprecated and will be removed soon. Use import() instead.` warning
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  devServer: {
    port: 8000,
    inline: true,
    hot: true,
    historyApiFallback: true
  },
  plugins: [
    ...(isDevServer ? [new webpack.HotModuleReplacementPlugin()] : []),
    new ForkTsCheckerWebpackPlugin({
      watch: ['./src', './demo'],
      formatter: 'codeframe',
      async: isDevServer
    }),
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)fesm5/,
      path.join(__dirname, 'src')
    ),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'demo', 'index.ejs')
    })
  ]
};
