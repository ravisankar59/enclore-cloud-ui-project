angular.module('encore')
/**
* @ngdoc filter
* @name encore:bytes
* @description
*
* Returns bytes in a more readable format with unit appended, e.g. '100.0 MB'.
*    - (DEFAULT) If no precision is provided, a default of 3 is used.
*    - will convert int or float
*    - will return N/A for everything else
*/
.filter('bytes', function () {
    /* @ngdoc method
     * @private
     *
     * @param {Number} bytes - number to format in bytes
     * @param {Number} precision - number of decimal places to show (DEFAULT 3 if none provided)
     * @returns {String} The formatted size with unit
    */
    return function (bytes, precision) {
        if (bytes === 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
            return 'N/A';
        }
        var k = 1024;
        var dm = precision || 3;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
        var number = Math.floor(Math.log(bytes) / Math.log(k));

        return (bytes / Math.pow(k, Math.floor(number))).toFixed(dm) +  ' ' + units[number];
    };
});
