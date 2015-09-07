var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var rescueServerModal = {};

rescueServerModal = baseModal.wrap(rescueServerModal);
module.exports = Page.create(rescueServerModal);
