var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var deleteVolumeModal = {};

deleteVolumeModal = baseModal.wrap(deleteVolumeModal);
module.exports = Page.create(deleteVolumeModal);
