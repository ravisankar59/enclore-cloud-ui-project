var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var deleteSnapshotModal = {};

deleteSnapshotModal = baseModal.wrap(deleteSnapshotModal);
module.exports = Page.create(deleteSnapshotModal);
