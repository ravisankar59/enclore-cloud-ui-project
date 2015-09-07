var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var detachVolumeModal = {};

detachVolumeModal = baseModal.wrap(detachVolumeModal);
module.exports = Page.create(detachVolumeModal);
