var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');
var selectedServersTable = require('./tables/selectedServers');

var bulkSuspend = {
    txtPassword: {
        get: function () { return $('input[admin-authenticate-validator]'); },
        set: function (password) {
            this.txtPassword.sendKeys(password);
        }
    },

    btnReturn: {
        get: function () { return $('#return-button'); }
    }
};

bulkSuspend = baseModal.wrap(bulkSuspend);
bulkSuspend = Page.create(bulkSuspend);
bulkSuspend.table = Page.create(selectedServersTable);

module.exports = bulkSuspend;
