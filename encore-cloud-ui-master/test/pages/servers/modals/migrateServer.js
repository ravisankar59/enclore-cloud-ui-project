var Page = require('astrolabe').Page;
var adminAuthModal = require('./adminAuth');

var migrateServerModal = {
    migrateServer: {
        value: function (options) {
            this.authenticate(options.password);
            this.submit();
        }
    },
};

migrateServerModal = adminAuthModal.wrap(migrateServerModal);
module.exports = Page.create(migrateServerModal);
