var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var nodesModal = {

    txtExternalIp: {
        get: function () { return $('#lbaas-external-node-ip'); }
    },

    numExternalPort: {
        get: function () { return $('#lbaas-external-node-port'); }
    },

    addExternalNode: {
        value: function (ip, port) {
            this.txtExternalIp.clear();
            this.txtExternalIp.sendKeys(ip);
            this.numExternalPort.clear();
            this.numExternalPort.sendKeys(port || '');
            this.submit();
        }
    },
};

nodesModal = baseModal.wrap(nodesModal);
module.exports = Page.create(nodesModal);
