var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var deleteInstanceModal = {};

deleteInstanceModal = baseModal.wrap(deleteInstanceModal);
module.exports = Page.create(deleteInstanceModal);
