var _ = require('lodash');
var keyValueTable = {
    // A key value table is a simple, two column table that has a "Name" column
    // or a "Key" column, and a second "Data", or "Value" column.
    // In this case, we will assume that the first column is the key, and the
    // second key is the value, and return a simple hash of the text in the table.
    //
    // Do not use this if you have the same data appear in the first column more
    // than once, since you'll lose that data when it gets over-ridden.
    initialize: function (rowElements) {
        var details = {};
        return rowElements.then(function (rows) {
            _.forEach(rows, function (row) {
                return row.$$('td').then(function (rowData) {
                    return rowData[0].getText().then(function (key) {
                        return rowData[1].getText().then(function (value) {
                            details[key] = value;
                        });
                    });
                });
            });
            return details;
        });
    }
};

// Returns an array containing all of the headers
function getTableHeaders (headerElements) {
    var headerLabels = [];
    return headerElements.then(function (headers) {
        _.map(headers, function (headerElement) {
            headerElement.getText().then(function (headerText) {
                headerLabels.push(headerText);
            });
        });
        return headerLabels;
    });
}

// Returns an object representation of the table.
// The first argument is the header elements of
// the table and the second is the rows of the table.
// this takes raw text out of the table so if there are
// any links or special cases that need to be taken into
// consideration, this is not the function you are looking for
function getTableData (tblHeadersSelector, tblRowsSelector) {

    var scrape = function (headerSelector, rowsSelector) {
        var map = Array.prototype.map;
        var headers = map.call(document.querySelectorAll(headerSelector), function (header) {
            return header.textContent.trim();
        });

        // Return the text data for rows
        var tblRows = [];
        map.call(document.querySelectorAll(rowsSelector), function (row) {
            var tblRowData = {};
            Array.prototype.forEach.call(row.cells, function (column, index) {
                var header = headers[index];
                if (header.length === 0) {
                    header = 'header' + index;
                }
                tblRowData[header] = column.textContent.trim();
            });
            tblRows.push(tblRowData);
        });
        return tblRows;
    };

    browser.waitForAngular();
    var scrapeData =  browser.executeScript(scrape, tblHeadersSelector, tblRowsSelector);
    return scrapeData;
}

function getKeyValueData (tblLabelsSelector, tblValuesSelector) {

    var scrape = function (tblLabelsSelector, tblValuesSelector) {
        var labels = document.querySelectorAll(tblLabelsSelector);
        var values = document.querySelectorAll(tblValuesSelector);

        var details = {};
        Array.prototype.forEach.call(labels, function (label, index) {
            var parsedLabel = label.textContent.replace(':', '').trim();
            var value = values[index].textContent.replace(/\s+/g, ' ').trim();
            details[parsedLabel] = value;
        });

        return details;
    };

    browser.waitForAngular();
    var scrapeData =  browser.executeScript(scrape, tblLabelsSelector, tblValuesSelector);
    return scrapeData;
}

module.exports = {
    keyValueTable: keyValueTable,
    getTableHeaders: getTableHeaders,
    getTableData: getTableData,
    getKeyValueData: getKeyValueData
};
