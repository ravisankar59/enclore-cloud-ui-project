var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var deleteLbModal = {};

deleteLbModal = baseModal.wrap(deleteLbModal);
module.exports = Page.create(deleteLbModal);
