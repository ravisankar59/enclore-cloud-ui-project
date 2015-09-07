var Page = require('astrolabe').Page;
var tblCommon = require('../../base/tablesCommon');

var vmFlavorTable = {
};

vmFlavorTable = tblCommon.wrap(vmFlavorTable);
module.exports = Page.create(vmFlavorTable);
