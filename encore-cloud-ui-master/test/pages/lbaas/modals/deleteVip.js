var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var deleteVipModal = {};

deleteVipModal = baseModal.wrap(deleteVipModal);
module.exports = Page.create(deleteVipModal);
