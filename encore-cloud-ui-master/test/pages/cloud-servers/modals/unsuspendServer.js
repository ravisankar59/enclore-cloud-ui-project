var Page = require('astrolabe').Page;
var adminAuthModal = require('./adminAuth');

var unsuspendServerModal = {
    unsuspendServer: {
        value: function (options) {
            this.authenticate(options.password);
            this.submit();
        }
    },
};

unsuspendServerModal = adminAuthModal.wrap(unsuspendServerModal);
module.exports = Page.create(unsuspendServerModal);
