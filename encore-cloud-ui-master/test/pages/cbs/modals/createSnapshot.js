var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');
var basePage = require('../../base');

var createSnapshotModal = {

    txtSnapshotName: {
        get: function () { return $('input#snapshotName'); }
    },

    txtSnapshotDescription: {
        get: function () { return $('input#snapshotDescription'); }
    },

    selSnapshotForce: {
        get: function () { return $('select#snapshotForce'); }
    },

    btnSnapshotCreate: {
        get: function () { return $('button.submit.ng-binding'); }
    },

    btnSnapshotCancel: {
        get: function () { return $('button.cancel'); }
    },

    createSnapshot: {
        value: function (snapshot) {
            this.txtSnapshotName.sendKeys(snapshot.name);
            this.txtSnapshotDescription.sendKeys(snapshot.description);
            basePage.selectItem(this.selSnapshotForce, 'option', snapshot.force);
            return this.btnSnapshotCreate.click();
        }
    }
};

createSnapshotModal = baseModal.wrap(createSnapshotModal);
module.exports = Page.create(createSnapshotModal);
