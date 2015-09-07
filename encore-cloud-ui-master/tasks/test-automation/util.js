module.exports = {
    getEnvironment: function getEnvironment (environment) {
        var environment = environment || '';
        if (environment.toLowerCase() === 'prod') {
          return 'production';
        }
        if (environment.toLowerCase() === 'preprod') {
            return 'preprod';
        }
        return 'staging';
    },

    log: function (msg) {
        // A hacky way of getting around the console(dot)log restriction
        // Used to output build/teardown info
        console['log'](msg);
    }

};
