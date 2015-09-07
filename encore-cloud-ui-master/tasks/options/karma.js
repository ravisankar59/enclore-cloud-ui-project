module.exports = {
    options: {
        configFile: 'karma.conf.js',
    },
    dev: {
        singleRun: false
    },
    debug: {
        singleRun: false,
        browsers: ['Chrome'],
        preprocessors: {
            'views/**/*.html': 'ng-html2js',
            'modules/**/*.html': 'ng-html2js',
        },
    },
    watch: {
        background:true
    },
    single: {
        singleRun: true
    },
    full: {
        singleRun: true,
        browsers: ['PhantomJS', 'Chrome', 'ChromeCanary', 'Firefox', 'Safari']
    }
};
