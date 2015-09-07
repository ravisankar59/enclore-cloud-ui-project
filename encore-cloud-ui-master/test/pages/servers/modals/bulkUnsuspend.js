var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');
var selectedServersTable = require('./tables/selectedServers');

var bulkUnsuspend = {
    txtPassword: {
        get: function () { return $('#field-0IO'); }
    },

    btnReturn: {
        get: function () { return $('#return-button'); }
    }
};

bulkUnsuspend = baseModal.wrap(bulkUnsuspend);
bulkUnsuspend = Page.create(bulkUnsuspend);
bulkUnsuspend.table = Page.create(selectedServersTable);

module.exports = bulkUnsuspend;
