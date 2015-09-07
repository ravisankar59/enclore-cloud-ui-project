/**
 * Configuration for selectSpec
 * @module selectSpec.config
 */

var path = require('path');

var config = {
    // The pattern tree that we'll use for selecting which spec files to run
    specPatterns: {
        'app': {
            'scripts': {
                'cbs': 'cbs/**/*.js',
                'cdn': 'cdn/**/*.js',
                'dbaas': 'dbaas/**/*.js',
                'heat': 'heat/**/*.js',
                'images': 'images/**/*.js',
                'lbaas': 'lbaas/**/*.js',
                'networks': 'networks/**/*.js',
                'servers': 'servers/**/*.js'
            },
            'views': {
                'cbs': 'cbs/**/*.js',
                'cdn': 'cdn/**/*.js',
                'dbaas': 'dbaas/**/*.js',
                'heat': 'heat/**/*.js',
                'images': 'images/**/*.js',
                'lbaas': 'lbaas/**/*.js',
                'networks': 'networks/**/*.js',
                'servers': 'servers/**/*.js'
            }
        },
        'test': {
            'api-mocks': {
                'requests': {
                    'cbs': 'cbs/**/*.js',
                    'cdn': 'cdn/**/*.js',
                    'databases': 'dbaas/**/*.js',
                    'heat': 'heat/**/*.js',
                    'images': 'images/**/*.js',
                    'loadbalancers': 'lbaas/**/*.js',
                    'networks': 'networks/**/*.js',
                    'servers': 'servers/**/*.js'
                },
                'responses': {
                    'cbs': 'cbs/**/*.js',
                    'cdn': 'cdn/**/*.js',
                    'databases': 'dbaas/**/*.js',
                    'heat': 'heat/**/*.js',
                    'images': 'images/**/*.js',
                    'loadbalancers': 'lbaas/**/*.js',
                    'networks': 'networks/**/*.js',
                    'servers': 'servers/**/*.js'
                }
            },
            'pages': {
                'cbs': 'cbs/**/*.js',
                'cdn': 'cdn/**/*.js',
                'cloud-servers': 'servers/**/*.js',
                'dbaas': 'dbaas/**/*.js',
                'heat': 'heat/**/*.js',
                'images': 'images/**/*.js',
                'lbaas': 'lbaas/**/*.js',
                'networks': 'networks/**/*.js',
                'servers': 'servers/**/*.js'
            },
            'stories': {
                'cbs': 'cbs/**/*.js',
                'cdn': 'cdn/**/*.js',
                'dbaas': 'dbaas/**/*.js',
                'heat': 'heat/**/*.js',
                'images': 'images/**/*.js',
                'lbaas': 'lbaas/**/*.js',
                'networks': 'networks/**/*.js',
                'servers': 'servers/**/*.js'
            }
        }
    },

    // The spec pattern to test for changed files that don't match the tree above
    defaultSpecPattern: '**/*.js',

    // The keyword list that we'll use for selecting which spec files to run
    keywordPatterns: {
        '%noall%': '-**/*.js', // Suppress the all pattern
        '%all%': '**/*.js',
        '%cbs%': 'cbs/**/*.js',
        '%cdn%': 'cdn/**/*.js',
        '%dbaas%': 'dbaas/**/*.js',
        '%heat%': 'heat/**/*.js',
        '%images%': 'images/**/*.js',
        '%lbaas%': 'lbaas/**/*.js',
        '%networks%': 'networks/**/*.js',
        '%servers%': 'servers/**/*.js'
    },

    // The base path to the stories
    basePath: path.resolve(__dirname, '../stories/')
};

module.exports = config;
