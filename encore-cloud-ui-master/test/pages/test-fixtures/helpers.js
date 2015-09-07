var _ = require('lodash');

module.exports = {
    buildObject: function buildObject (keys, fn) {
    /**
     * This function is used to create an object with keys that contain similar bodies for our test fixtures.
     * buildObject creates objects with the keys passed in the first argument using the function 
     * passed in the second argument and then consolidates all the object into one object with multiple keys
     * using _.reduce
     *
     * see 'test/pages/test-fixtures/api/servers.js' for example
     *
     * keys: a list of keys to be created
     * fn: a function that takes a key as the first argument and returns an object with the key
     *     passed in as the first argument and a value to that key.
     */
        keys = _.map(keys, fn);
        return _.reduce(keys, function (obj, val) {
            var key = _.first(_.keys(val));
            obj[key] = val[key];
            return obj;
        }, {});
    }
};
