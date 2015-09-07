var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var verifyServerModal = {};

verifyServerModal = baseModal.wrap(verifyServerModal);
module.exports = Page.create(verifyServerModal);
