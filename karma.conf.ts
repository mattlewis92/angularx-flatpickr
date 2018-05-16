import * as webpack from 'webpack';
import * as path from 'path';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export default (config: any) => {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: ['test/entry.ts'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/entry.ts': ['webpack', 'sourcemap']
    },

    webpack: {
      mode: 'development',
      resolve: {
        extensions: ['.ts', '.js']
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: 'tslint-loader',
            exclude: /node_modules/,
            enforce: 'pre',
            options: {
              tslint: {
                emitErrors: config.singleRun,
                failOnHint: config.singleRun
              }
            }
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
            test: /src\/.+\.ts$/,
            exclude: /(node_modules|\.spec\.ts$)/,
            loader: 'istanbul-instrumenter-loader',
            enforce: 'post'
          },
          {
            test: /node_modules\/@angular\/core\/.+\/core\.js$/,
            parser: {
              system: true // disable `System.import() is deprecated and will be removed soon. Use import() instead.` warning
            }
          }
        ]
      },
      plugins: [
        new webpack.SourceMapDevToolPlugin({
          filename: null,
          test: /\.(ts|js)($|\?)/i
        }),
        new webpack.ContextReplacementPlugin(
          /angular(\\|\/)core(\\|\/)esm5/,
          path.join(__dirname, 'src')
        ),
        new ForkTsCheckerWebpackPlugin({
          watch: ['./src', './test'],
          formatter: 'codeframe',
          async: !config.singleRun
        })
      ],
      optimization: {
        noEmitOnErrors: config.singleRun
      }
    },

    coverageIstanbulReporter: {
      reports: ['text-summary', 'html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },

    mime: {
      'text/x-typescript': ['ts']
    },

    mochaReporter: {
      showDiff: true,
      output: 'autowatch'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage-istanbul'],

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless']
  });
};
