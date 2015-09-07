var Page = require('astrolabe').Page;
var adminAuthModal = require('./adminAuth');

var removeIpModal = {
    removeIp: {
        value: function (options) {
            this.authenticate(options.password);
            this.submit();
        }
    },
};

removeIpModal = adminAuthModal.wrap(removeIpModal);
module.exports = Page.create(removeIpModal);
