var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var createDatabaseModal = {

    txtDatabaseName: {
        get: function () { return $('#databaseName'); }
    },

    txtCharacterSet: {
        get: function () { return $('#characterSet'); }
    },

    txtCollation: {
        get: function () { return $('#collate'); }
    },

    lblDatabaseName: {
        get: function () { return $('label[for="databaseName"]'); }
    },

    lblCharacterSet: {
        get: function () { return $('label[for="characterSet"]'); }
    },

    lblCollation: {
        get: function () { return $('label[for="collate"]'); }
    },

    createDatabase: {
        value: function (options) {
            this.txtDatabaseName.sendKeys(options.name);
            this.txtCharacterSet.sendKeys(options.characterSet);
            this.txtCollation.sendKeys(options.collation);
            this.submit();
        }
    },
};

createDatabaseModal =  baseModal.wrap(createDatabaseModal);
module.exports = Page.create(createDatabaseModal);
