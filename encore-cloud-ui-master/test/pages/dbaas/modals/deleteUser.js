var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var deleteUserModal = {};

deleteUserModal = baseModal.wrap(deleteUserModal);
module.exports = Page.create(deleteUserModal);
