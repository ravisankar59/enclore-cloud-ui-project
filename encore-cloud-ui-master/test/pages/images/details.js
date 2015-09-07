var Page = require('astrolabe').Page;
var _ = require('lodash');
var imagesOverviewPage = require('./overview');
var imageDetailsTable = require('./details/detailsTable');
var imageMetadataTable = require('./details/metadataTable');

var imageDetailsPage = Page.create({

    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/images';
        }
    },

    open: {
        value: function (query, filter) {
            var page = this;
            var args = arguments;
            var defaultImageQuery = {
                localhost: 'ORD/547a46bd-d913-4bf7-ac35-2f24f25f1b7a',
                staging: 'QE-ORD/7e746552-2212-41d7-b216-a1024b83b0c4',
                preprod: 'ORD/7e746552-2212-41d7-b216-a1024b83b0c4',
                prod: 'ORD/7e746552-2212-41d7-b216-a1024b83b0c4'
            };
            imagesOverviewPage.go();

            encore.rxEnvironment.current().then(function (env) {
                if (_.isEmpty(args)) {
                    page.go(defaultImageQuery[env]);
                } else {
                    imagesOverviewPage.table.viewImageDetails(query, filter);
                }
            });
            basePage.disableRxNotifyTimeout();
        }
    },

    lnkCreateServer: {
        get: function () {
            return $('a.create-server.msg-action');
        }
    },

    lnkDeleteServer: {
        get: function () {
            return $('a i.delete-image-action');
        }
    },

    lnkBaseImage: {
        get: function () {
            return $('a.base-image');
        }
    }

});

// tables
imageDetailsPage.table = imageDetailsTable;
imageDetailsPage.metadata = imageMetadataTable;

// modals
imageDetailsPage.deleteImageModal = require('./modals/deleteImage');

module.exports = imageDetailsPage;
