var _ = require('lodash');
var timezone = require('moment-timezone');

function combine () {
    return _.reduce(arguments, function (result, tableObject) {
        return _.merge(result, tableObject);
    }, {});
}

function parseTimeInUTC (timeString, parseFormat) {
    var tzOutput = 'UTC';

    return timezone(timeString, parseFormat)
        .tz(tzOutput)
        .format(parseFormat);
}//parseTimeInUTC

module.exports = {
    combine: combine,
    parseTimeInUTC: parseTimeInUTC,
    dateTimeFormat: 'MMM D, YYYY @ HH:mm (UTCZZ)'
};
