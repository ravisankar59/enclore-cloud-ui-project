var _ = require('lodash');

var wait = {
    // Reloads the page until the expected text is found in the data returned
    // from the function passed in opts
    value: function (opts, callback) {
        // opts accepts these 4 arguments as a key:value Array-
        // fn: function to perform
        // fnArgs: array of arguments to pass into the function
        // checkFn: function to verify expected action is complete
        // expectedText: text to wait for
        // timeout: timeout in minutes, the default is five minutes
        var page = this;
        var timeoutErr = function () {
            var err = 'timeout reached';
            callback(err);
        };

        var waitFn = function (waitOpts) {
            // check if timeout reached 
            if (_.isNull(waitOpts.timeoutId['_idleNext'])) {
                return waitOpts.d.reject(new Error('Timeout Reached'));
            }

            waitOpts.fnArgs = waitOpts.fnArgs || [];
            var doFunction = waitOpts.fn.apply(page, waitOpts.fnArgs);

            doFunction.then(function (data) {
                var complete = waitOpts.checkFn(data);

                if (complete) {
                    // This will stop the loop if condition is met
                    clearTimeout(waitOpts.timeoutId);
                    waitOpts.d.fulfill(data);
                } else {
                    // If the returned data contains a status, verify
                    // the object has not entered an ERROR status.
                    // If not in ERROR status, this will wait for 5 seconds, 
                    // grab the current URL, then call itself if condition still not met
                    if (!_.isUndefined(data.Status)) {
                        if (data.Status === 'ERROR') {
                            throw new Error('Object returned an ERROR status.');
                        }
                    }
                    page.driver.sleep(5000);
                    page.driver.getCurrentUrl().then(function (url) {
                        page.driver.get(url);
                        waitFn(waitOpts);
                    });
                }
            });
        };

        opts.timeout = opts.timeout || 5;
        opts.timeout *= (60 * 1000);
        opts.timeoutId = setTimeout(timeoutErr, opts.timeout);

        opts.d = protractor.promise.defer();
        waitFn(opts);
        return opts.d.promise;
    }
};

module.exports = wait;
