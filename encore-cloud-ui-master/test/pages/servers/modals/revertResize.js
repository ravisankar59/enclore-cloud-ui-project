var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var revertServerModal = {};

revertServerModal = baseModal.wrap(revertServerModal);
module.exports = Page.create(revertServerModal);
