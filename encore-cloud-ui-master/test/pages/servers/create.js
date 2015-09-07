var _ = require('lodash');
var Page = require('astrolabe').Page;
var basePage = require('../base');
var networksTable = require('./create/networksTable');
var savedImagesTable = require('./create/savedImagesTable');
var rxImagesTable = require('./create/rxImagesTable');
var bootableVolumesForm = require('./create/bootableVolumesForm');
var tblUtil = require('../base/util/tables');

var create = {
    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/servers/create';
        }
    },

    openFirstGen: {
        value: function (region) {
            this.go();
            var regionOpts = {
                label: region || 'DFW (Dallas)',
                type: 'FirstGen'
            };
            this.selRegion = regionOpts;
        }
    },

    openNextGen: {
        value: function (region) {
            this.go();
            var regionOpts = {
                label: region || 'ORD (Chicago)',
                type: 'NextGen'
            };
            this.selRegion = regionOpts;
        }
    },

    lnkFlavors: {
        get: function () {
            return element(by.cssContainingText('a', 'Go to Flavors Wiki (internal)'));
        }
    },

    lnkFlavorsHref: {
        get: function () {
            return this.lnkFlavors.getAttribute('href');
        }
    },

    lnkCalculator: {
        get: function () {
            return element(by.cssContainingText('a', 'Go to Calculator'));
        }
    },

    lnkCalculatorHref: {
        get: function () {
            return this.lnkCalculator.getAttribute('href');
        }
    },

    lnkCloudServersOverview: {
        get: function () {
            return element(by.cssContainingText('a', 'Go to Cloud Servers Overview'));
        }
    },

    lnkCloudServersOverviewHref: {
        get: function () {
            return this.lnkCloudServersOverview.getAttribute('href');
        }
    },

    lblServerName: {
        get: function () { return $('rx-form-item[label="Server Name"] label.field-label'); }
    },

    txtServerName: {
        get: function () { return $('#serverName'); },
        set: function (serverName) {
            this.txtServerName.clear();
            this.txtServerName.sendKeys(serverName);
        }
    },

    rackConnectRegionMessageElement: {
        get: function () { return $('rx-form-item[label="Region"] span.msg-info'); }
    },

    rackConnectRegionMessage: {
        value: function () { return this.rackConnectRegionMessageElement.getText(); }
    },

    rackConnectNetworksMessageElement: {
        get: function () { return $('rx-form-fieldset[legend="Networks"] .field-input .msg-info'); }
    },

    rackConnectNetworksMessage: {
        value: function () { return this.rackConnectNetworksMessageElement.getText(); }
    },

    rackConnect3WarningMessageElement: {
        get: function () { return $('rx-form-fieldset[legend="Networks"] .field-input .msg-warn'); }
    },

    rackConnect3WarningMessage: {
        value: function () { return this.rackConnect3WarningMessageElement.getText(); }
    },

    lblRegion: {
        get: function () { return $('rx-form-item[label="Region"] label.field-label'); }
    },

    selRegion: {
        get: function () { return $('select#region'); },
        set: function (region) {
            // region.type: First or NextGen region
            // region.label: Name of the region to select
            var xpath = 'optgroup[@label="' + region.type + '"]/option';
            basePage.selectItem(this.selRegion, xpath, region.label);
        }
    },

    tabRxImages: {
        get: function () { return $('#imageTabs li:first-of-type a'); }
    },

    tabSavedImages: {
        get: function () { return $('#imageTabs li:last-of-type a'); }
    },

    tabGeneral: {
        get: function () { return $('ul.nav-tabs li.general a'); }
    },

    tabCompute: {
        get: function () { return $('ul.nav-tabs li.compute a'); }
    },

    tabIO: {
        get: function () { return $('ul.nav-tabs li.io a'); }
    },

    tabMemory: {
        get: function () { return $('ul.nav-tabs li.memory a'); }
    },

    tabPerformance1: {
        get: function () { return $('ul.nav-tabs li.performance1 a'); }
    },

    tabPerformance2: {
        get: function () { return $('ul.nav-tabs li.performance2 a'); }
    },

    tabStandard: {
        get: function () { return $('ul.nav-tabs li.standard a'); }
    },

    tabOnMetal: {
        get: function () { return $('ul.nav-tabs li.onmetal a'); }
    },

    tabClassic: {
        get: function () { return $('ul.nav-tabs li.classic a'); }
    },

    flavorTab: {
        value: function (flavor) {
            return $('ul.nav-tabs li.' + flavor + ' a');
        }
    },

    currentFlavor: {
        value: function () {
            return $('div.flavors ul.nav-tabs li.active').getAttribute('id');
        }
    },

    currentImage: {
        value: function () {
            return $('div#imageTabs ul.nav-tabs li.active').getAttribute('id');
        }
    },

    cssImagesTable: {
        get: function () {
            return this.currentImage().then(function (image) {
                return 'rx-option-table#imageType_' + image + ' table.rx-option-table ';
            });
        }
    },

    numVolumeSize: {
        get: function () {
            return this.fldBootableVolumes.then(function (ele) {
                return ele.element(by.id('volumeSize'));
            });
        },
        set: function (size) {
            this.numVolumeSize.then(function (ele) {
                ele.sendKeys(size);
            });
        }
    },

    radDeleteOnTermination: {
        get: function () {
            return this.fldBootableVolumes.then(function (ele) {
                return ele.element(by.id('deleteOnTerminationTrue'));
            });
        },
    },

    radNoDeleteOnTermination: {
        get: function () {
            return this.fldBootableVolumes.then(function (ele) {
                return ele.element(by.id('deleteOnTerminationFalse'));
            });
        }
    },

    deleteOnTermination: {
        value: function (willDelete) {
            if (willDelete) {
                this.radDeleteOnTermination.then(function (ele) {
                    ele.click();
                });
            } else {
                this.radNoDeleteOnTermination.then(function (ele) {
                    ele.click();
                });
            }
        }
    },

    fieldsetVolume: {
        get: function () { return $('fieldset#bootable-volume-fields'); }
    },

    // TODO: move flavor related values to vmFlavorsTable.js
    cssFlavorsTable: {
        get: function () {
            return this.currentFlavor().then(function (flavor) {
                return 'rx-option-table#flavorOptions_' + flavor + ' table.rx-option-table ';
            });
        }
    },

    flavorHeaders: {
        value: function () {
            return this.cssFlavorsTable.then(function (selector) {
                var headers = selector + 'thead th';
                return tblUtil.getTableHeaders($$(headers));
            });
        }
    },

    flavorsData: {
        value: function () {
            var page = this;
            return this.cssFlavorsTable.then(function (selector) {
                var headers = selector + 'thead th';
                var rows = selector + 'tbody tr';
                return tblUtil.getTableData(headers, rows).then(function (data) {
                    return page.currentFlavor().then(function (flavor) {
                        return _.map(data, function (row, index) {
                            row.select = function () {
                                $('#serverFlavor' + flavor + '_' + index).click();
                            };

                            return row;
                        });
                    });
                });
            });
        }
    },

    imagesData: {
        value: function () {
            var page = this;
            return this.cssImagesTable.then(function (selector) {
                var headers = selector + 'thead th';
                var rows = selector + 'tbody tr';
                return tblUtil.getTableData(headers, rows).then(function (data) {
                    return page.currentImage().then(function (image) {
                        return _.map(data, function (row, index) {
                            row.select = function () {
                                $('#server' + image + 'Image_' + index).click();
                            };

                            return row;
                        });
                    });
                });
            });
        }
    },

    eleStandardFlavorsTable: {
        get: function () {
            return $('rx-option-table[field-id="serverFlavorstandard"] table.rx-option-table');
        }
    },

    btnCreateServer: {
        get: function () { return $('div.form-actions button.submit'); }
    },

    tblNetworksList: {
        get: function () { return $('.networks-list'); }
    },

    allFlavorTabs: {
        value: function () {
            return {
                compute: this.flavorTab('compute'),
                general: this.flavorTab('general'),
                io: this.flavorTab('io'),
                memory: this.flavorTab('memory'),
                onmetal: this.flavorTab('onmetal'),
                performance1: this.flavorTab('performance1'),
                performance2: this.flavorTab('performance2'),
                standard: this.flavorTab('standard'),
            };
        }
    },

    selectFlavor: {
        value: function (flavor) {
            this.allFlavorTabs()[flavor.type].click();
            this.flavorsData().then(function (rows) {
                var flavorRow = _.find(rows, { Name: flavor.name });
                if (_.isUndefined(flavorRow)) {
                    throw new Error('Unable to find a flavor with the name "' + flavor.name + '"');
                } else {
                    flavorRow.select();
                }
            });
        }
    },

    selectImage: {
        value: function (image) {
            var imageTabs = {
                rackspace: this.tabRxImages,
                saved: this.tabSavedImages
            };

            imageTabs[image.type].click();
            this.imagesData().then(function (images) {
                var imageRow = _.find(images, { Name: image.name });
                if (_.isUndefined(imageRow)) {
                    throw new Error('Unable to find an image with the name "' + image.name + '"');
                } else {
                    imageRow.select();
                }
            });
        }
    },

    selectNetworks: {
        value: function (networkNames) {
            _.each(networkNames, function (networkName) {
                this.networksTable.find({ Name: networkName }).check();
            });
        }
    },

    filloutFields: {
        value: function (opts) {
            if (opts.name) {
                this.txtServerName = opts.name;
            }

            if (opts.region) {
                this.selRegion = opts.region;
            }

            if (opts.flavor) {
                this.selectFlavor(opts.flavor);
            }

            if (opts.image) {
                this.selectImage(opts.image);
            }

            if (opts.networks) {
                this.selectNetworks(opts.networks);
            }

            if (opts.bootSource) {
                if (_.isEqual(opts.region.type, 'NextGen')) {
                    var bootForm = this.bootableVolumesForm.initialize(opts.flavor.type);
                    bootForm.selectBootSource(opts.bootSource.type);
                }
            }
        }
    },

    createServer: {
        value: function (opts) {
            this.filloutFields(opts);
            this.btnCreateServer.click();
        }
    },

    availableFlavorTabs: {
        value: function () {
            var fetchFlavors = 'return angular.element(document.querySelector(\'div.flavors\')).scope().flavorClasses';
            var allFlavors = this.allFlavorTabs();
            return this.driver.executeScript(fetchFlavors).then(function (flavors) {
                return _.transform(flavors, function (res, flavor) {
                    var flavorTitle = [flavor.id, 'flavor tab'].join(' ');
                    res[flavorTitle] = allFlavors[flavor.id];
                    return res;
                }, {});
            });
        }
    },

    btnCancel: {
        get: function () { return element(by.id('btnCancel')); }
    }
};

var createPage = Page.create(create);
createPage.networksTable = networksTable;
createPage.savedImagesTable = savedImagesTable;
createPage.rxImagesTable = rxImagesTable;
createPage.bootableVolumesForm = bootableVolumesForm;

module.exports = createPage;
