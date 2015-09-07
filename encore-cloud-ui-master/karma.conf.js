/* jshint node:true */

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: 'app/',


        // frameworks to use
        frameworks: ['mocha', 'chai', 'sinon-chai'],


        // list of files / patterns to load in the browser
        files: [
            'bower_components/jquery/jquery.min.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-hotkeys/build/hotkeys.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'bower_components/momentjs/moment.js',
            'bower_components/lodash/dist/lodash.js',
            'bower_components/ng-debounce/angular-debounce.js',
            'bower_components/encore-ui/encore-ui-tpls.js',
            'bower_components/encore-ui-svcs/dist/encore-ui-svcs.js',
            'scripts/app.js', // always load app definition first
            'scripts/**/*.js',
            '../test/browser-helpers.js',
            '../test/resource-helpers.js',
            'views/**/*.html',// templates
        ],

        // list of files to exclude
        exclude: [
        ],

        preprocessors: {
            'views/**/*.html': 'ng-html2js',
            'modules/**/*.html': 'ng-html2js',
            // TODO figure out how to filter 'lib' folder
            'scripts/**/!(*.spec).js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['mocha', 'coverage', 'threshold'],

        coverageReporter: {
            type : 'html',
            dir : '../coverage/'
        },

        thresholdReporter: {
            // #TODO: Set threshold back up once we're close enough, until then it's going to be a slow process
            // statements: 90,
            // branches: 60,
            // functions: 85,
            // lines: 90
            statements: 53,
            branches: 42,
            functions: 47,
            lines: 53
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values:
        //  config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
