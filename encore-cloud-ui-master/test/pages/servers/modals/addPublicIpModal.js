var Page = require('astrolabe').Page;
var adminAuthModal = require('./adminAuth');

var addPublicIpModal = {
    addIp: {
        value: function (options) {
            this.authenticate(options.password);
            this.submit();
        }
    },
};

addPublicIpModal = adminAuthModal.wrap(addPublicIpModal);
module.exports = Page.create(addPublicIpModal);
