var Page = require('astrolabe').Page;
var _ = require('lodash');
var basePage = require('../../base');
var baseDetails = require('../base/details');
var serversOverviewPage = require('../overview');

var nextGenDetailsPage = {

    url: {
        get: function  () {
            var user = ptor.params.user;
            var accountNumber = ptor.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/servers/ORD';
        }
    },

    open: {
        /**
         * Opens NextGen Details Page
         *
         * serverQuery can be an object with keys containing the values of the desired server
         * i.e. { name: serverName, id: 12345 }
         * serverQuery can also be an ID to a midway
         */
        value: function (serverQuery, filter) {
            if (basePage.isInMidwayEnvironment()) {
                var midwayServerId = '2999ca73-f2d7-4275-ba45-84753332903b';
                serverQuery = (_.isString(serverQuery)) ? serverQuery : midwayServerId;
                return this.go(serverQuery);
            }

            serversOverviewPage.go();

            if (_.isEmpty(arguments)) {
                serversOverviewPage.table.sortBy('Gen', false);
                return serversOverviewPage.table.row(1).then(function (rowData) {
                    rowData.viewDetails();
                });
            }

            serversOverviewPage.table.viewServerDetails(serverQuery, filter);
            basePage.disableRxNotifyTimeout();
        }
    },

    lnkOhThree: {
        get: function () { return $('a[ng-if="server.ohthree"]'); }
    },

    lnkOpenConsole: {
        get: function () { return $('a.console'); }
    },

    lnkReach: {
        get: function () { return $('a.rx-reach-link-action'); }
    },

    lnkCloudControl: {
        get: function () { return $('a.rx-cloud-control-link-action'); }
    },

    btnAttachVolume: {
        get: function () { return $('a i.fa-paperclip'); }
    },

    createImage: {
        value: function (imageName) {
            var imageNameField = this.frmRxModal.$('#server_name');
            var submit = this.frmRxModal.$('button.submit');

            this.btnCreateImage.click();
            imageNameField.sendKeys(imageName);
            submit.click();
        }
    },

    attachVolume: {
        value: function (volumeName, devicePath) {
            this.btnAttachVolume.click();
            this.attachVolumeModal.attachVolume(volumeName, devicePath);
        }
    },

    openOhThree: {
        value: function () { this.lnkOhThree.click(); }
    },

    cloudControlPageTitle: {
        get: function () {
            var ptor = browser.driver;

            return this.lnkCloudControl.click().then(function () {
                ptor.sleep(1000);
                return ptor.getAllWindowHandles().then(function (handles) {
                    var parentHandle = handles[0];
                    var cloudControlHandle = handles[1];
                    ptor.switchTo().window(cloudControlHandle);
                    return ptor.getTitle().then(function (pageTitle) {
                        ptor.switchTo().window(parentHandle);
                        return pageTitle;
                    });
                });
            });
        }
    },

    ohThreePageTitle: {
        get: function () {
            var ptor = browser.driver;

            return this.lnkOhThree.click().then(function () {
                ptor.sleep(1000);
                return ptor.getAllWindowHandles().then(function (handles) {
                    var parentHandle = handles[0];
                    var ohThreeHandle = handles[1];
                    ptor.switchTo().window(ohThreeHandle);
                    return ptor.getTitle().then(function (pageTitle) {
                        ptor.switchTo().window(parentHandle);
                        return pageTitle;
                    });
                });
            });
        }
    },

    consolePageTitle: {
        get: function () {
            var ptor = browser.driver;

            return baseDetails.btnOpenConsole.click().then(function () {
                ptor.sleep(5000);
                return ptor.getAllWindowHandles().then(function (handles) {
                    var parentHandle = handles[0];
                    var consoleHandle = handles[1];
                    ptor.switchTo().window(consoleHandle);
                    return ptor.getTitle().then(function (consoleTitle) {
                        ptor.switchTo().window(parentHandle);
                        return consoleTitle;
                    });
                });
            });
        }
    },

    row0: {
        value: function (tableClass) {
            return $$(tableClass + ' tbody tr').then(function (rows) {
                return rows[0].$$('td').then(function (td) {
                    return td[0].getText().then(function (text) {
                        return text;
                    });
                });
            });
        }
    },

    ipsMessage: {
        value: function () {
            return this.row0('.server-ips');
        }
    },

    metadataMessage: {
        value: function () {
            return this.row0('.device-metadata');
        }
    },

    volumesMessage: {
        value: function () {
            return this.row0('.server-attached-volumes');
        }
    }
};

nextGenDetailsPage = baseDetails.wrap(nextGenDetailsPage);
nextGenDetailsPage = Page.create(nextGenDetailsPage);

//tables
nextGenDetailsPage.detailsTable = require('./detailsTable');
nextGenDetailsPage.ipTable = require('./ipTable');
nextGenDetailsPage.deviceTable = require('./deviceTable');
nextGenDetailsPage.volumesTable = require('./volumesTable');
nextGenDetailsPage.sshTable = require('./sshTable');
nextGenDetailsPage.passwordTable = require('./passwordTable');

//modals
nextGenDetailsPage.createImageModal = require('../modals/createImage');
nextGenDetailsPage.attachVolumeModal = require('../modals/attachVolume');
nextGenDetailsPage.changePasswordModal = require('../modals/changePassword');
nextGenDetailsPage.changeNameModal = require('../modals/changeName');
nextGenDetailsPage.changeNicknameModal = require('../modals/changeNickname');
nextGenDetailsPage.rebootServerModal = require('../modals/rebootServer');
nextGenDetailsPage.rebuildServerModal = require('../modals/rebuildServer');
nextGenDetailsPage.resizeServerModal = require('../modals/resizeServer');
nextGenDetailsPage.rescueServerModal = require('../modals/rescueServer');
nextGenDetailsPage.deleteServerModal = require('../modals/deleteServer');
nextGenDetailsPage.migrateServerModal = require('../modals/migrateServer');
nextGenDetailsPage.suspendServerModal = require('../modals/suspendServer');
nextGenDetailsPage.unsuspendServerModal = require('../modals/unsuspendServer');
nextGenDetailsPage.addPublicIpModal = require('../modals/addPublicIpModal');
nextGenDetailsPage.removeIpModal = require('../modals/removeIpModal');

module.exports = nextGenDetailsPage;
