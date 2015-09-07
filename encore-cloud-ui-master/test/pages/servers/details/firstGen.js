var _ = require('lodash');
var Page = require('astrolabe').Page;
var basePage = require('../../base');
var baseDetails = require('../base/details');
var serversOverviewPage = require('../overview');

var firstGenDetailsPage = {

    url: {
        get: function  () {
            var user = ptor.params.user;
            var accountNumber = ptor.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/servers/firstgen';
        }
    },

    open: {
        /**
         * Opens FirstGen Details Page
         *
         * serverQuery can be an object with keys containing the values of the desired server
         * i.e. { name: serverName, id: 12345 }
         * serverQuery can also be an ID to a midway
         */
        value: function (serverQuery, filter) {
            if (basePage.isInMidwayEnvironment()) {
                var midwayServerId = '110148309';
                serverQuery = (_.isString(serverQuery)) ? serverQuery : midwayServerId;
                return this.go(serverQuery);
            }

            serversOverviewPage.go();

            if (_.isEmpty(arguments)) {
                serversOverviewPage.table.sortBy('Gen');
                return serversOverviewPage.table.row(1).then(function (rowData) {
                    return rowData.viewDetails();
                });
            }

            return serversOverviewPage.table.viewServerDetails(serverQuery, filter);
        }
    },

    serverActionList: {
        get: function () { return $('.actions-area'); }
    },

    lnkReach: {
        get: function () { return $('a.rx-reach-link-action'); }
    },

    lnkCloudControl: {
        get: function () { return $('a.rx-cloud-control-link-action'); }
    },

    btnResizeServer: {
        get: function () { return $('a i.fa-arrows-alt'); }
    },

    btnOpenConsole: {
        get: function () { return $('a i.fa-terminal'); }
    },

    btnCreateNextgenImage: basePage.actionBtn('Create NextGen Image'),

    lnkBackstage: {
        get: function () {
            return element(by.cssContainingText('a', '(Backstage)'));
        }
    },

    createNextgenImage: {
        value: function (imageName) {
            this.btnCreateNextgenImage.click();
            var imageNameField = this.frmRxModal.$('#server_name');
            imageNameField.sendKeys(imageName);
            basePage.modalConfirmButton.click();
        }
    },

    consolePageTitle: {
        get: function () {
            var ptor = browser.driver;

            return this.btnOpenConsole.click().then(function () {
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
    }

};

firstGenDetailsPage = baseDetails.wrap(firstGenDetailsPage);
firstGenDetailsPage = Page.create(firstGenDetailsPage);

//tables
firstGenDetailsPage.detailsTable = require('./detailsTable');
firstGenDetailsPage.ipTable = require('./ipTable');
firstGenDetailsPage.deviceTable = require('./deviceTable');
firstGenDetailsPage.backupTable = require('./backupTable');
firstGenDetailsPage.passwordTable = require('./passwordTable');

//modals
firstGenDetailsPage.createImageModal = require('../modals/createImage');
firstGenDetailsPage.attachVolumeModal = require('../modals/attachVolume');
firstGenDetailsPage.changePasswordModal = require('../modals/changePassword');
firstGenDetailsPage.changeNameModal = require('../modals/changeName');
firstGenDetailsPage.rebootServerModal = require('../modals/rebootServer');
firstGenDetailsPage.rebuildServerModal = require('../modals/rebuildServer');
firstGenDetailsPage.resizeServerModal = require('../modals/resizeServer');
firstGenDetailsPage.rescueServerModal = require('../modals/rescueServer');
firstGenDetailsPage.deleteServerModal = require('../modals/deleteServer');

module.exports = firstGenDetailsPage;
