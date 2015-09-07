var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var restartInstanceModal = {};

restartInstanceModal = baseModal.wrap(restartInstanceModal);
module.exports = Page.create(restartInstanceModal);
