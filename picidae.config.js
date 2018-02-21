module.exports = {
    theme: './themes/picidae-theme-crystal',
    verbose: true,
    port: 8989,
    publicPath: '/',
    expressSetup: null,
    webpackConfigUpdater: null,
    ssrWebpackConfigUpdater: null,
    docRoot: './articles',
    distRoot: './public',
    templateRoot: './templates',
    extraRoot: './extra',
    themeConfigsRoot: './theme-configs',
    hotReloadTests: [/\.(md|markdown)$/i],
    excludes: [/\.ignore\./],
    transformers: [],
    commanders: [
        'gh-pages?repo=git@github.com:Claiyre/Claiyre.github.io.git&branch=master&remote=origin'
    ]
}
