var Page = require('astrolabe').Page;
var adminAuthModal = require('./adminAuth');

var suspendServerModal = {
    suspendServer: {
        value: function (options) {
            this.authenticate(options.password);
            this.submit();
        }
    },
};

suspendServerModal = adminAuthModal.wrap(suspendServerModal);
module.exports = Page.create(suspendServerModal);
