var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var deleteImageModal = {};

deleteImageModal = baseModal.wrap(deleteImageModal);
module.exports = Page.create(deleteImageModal);
