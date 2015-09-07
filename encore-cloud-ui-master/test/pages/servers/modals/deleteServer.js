var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var deleteServerModal = {};

deleteServerModal = baseModal.wrap(deleteServerModal);
module.exports = Page.create(deleteServerModal);
