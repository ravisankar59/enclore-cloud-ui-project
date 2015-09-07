var _ = require('lodash');
var Page = require('astrolabe').Page;
var basePage = require('../base');

var dbaasCreatePage = Page.create({

    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/databases/instances/create';
        }
    },

    title: {
        get: function () { return basePage.pageTitle; }
    },

    subtitle: {
        get: function () { return basePage.pageSubtitle; }
    },

    lblInstanceName: {
        get: function () { return $('rx-form-item[label="Name"] label.field-label'); }
    },

    txtInstanceName: {
        get: function () { return $('#instanceName'); },
        set: function (name) {
            this.txtInstanceName.clear();
            this.txtInstanceName.sendKeys(name);
        }
    },

    lblRegion: {
        get: function () { return $('rx-form-item[label="Region"] label.field-label'); }
    },

    selRegion: {
        get: function () { return $('#instanceRegion'); },
        set: function (region) {
            basePage.selectItem(this.selRegion, 'option', region);
        }
    },

    lblVolumeSize: {
        get: function () { return $('rx-form-item[label="Volume Size"] label.field-label'); }
    },

    numVolumeSize: {
        get: function () { return $('#volumeSize'); },
        set: function (size) {
            this.numVolumeSize.clear();
            this.numVolumeSize.sendKeys(size);
        }
    },

    lblFlavor: {
        get: function () { return $('rx-form-item[label="Flavor"] label.field-label'); }
    },

    selFlavor: {
        get: function () { return $('#instanceFlavor'); },
        set: function (flavor) {
            basePage.selectItem(this.selFlavor, 'option', flavor);
        }
    },

    lblDatabaseName: {
        get: function () { return $('rx-form-item[label="Database Name"] span.field-label'); }
    },

    txtDatabaseName: {
        get: function () { return $('#instanceDatabaseName'); },
        set: function (name) {
            this.txtDatabaseName.clear();
            this.txtDatabaseName.sendKeys(name);
        }
    },

    lblUserName: {
        get: function () { return $('rx-form-item[label="User Name"] span.field-label'); }
    },

    txtUsername: {
        get: function () { return $('#instanceUserName'); },
        set: function (username) {
            this.txtUsername.clear();
            this.txtUsername.sendKeys(username);
        }
    },

    lblPassword: {
        get: function () { return $('label[for="password"]'); }
    },

    txtPassword: {
        get: function () { return $('#password'); },
        set: function (password) {
            this.txtPassword.clear();
            this.txtPassword.sendKeys(password);
        }
    },

    lblConfirmPassword: {
        get: function () { return $('label[for="repeatPassword"]'); }
    },

    txtConfirmPassword: {
        get: function () { return $('#repeatPassword'); },
        set: function (password) {
            this.txtConfirmPassword.clear();
            this.txtConfirmPassword.sendKeys(password);
        }
    },

    btnCancel: {
        get: function () { return $('#btnCancel'); }
    },

    btnConfirm: {
        get: function () { return $('#btnCreateInstance'); }
    },

    filloutFields: {
        value: function (opts) {
            var page = this;
            var fields = {
                name: 'txtInstanceName',
                region: 'selRegion',
                volumeSize: 'numVolumeSize',
                flavor: 'selFlavor',
                dbName: 'txtDatabaseName',
                dbUsername: 'txtUsername',
                password: 'txtPassword',
                confirmPassword: 'txtConfirmPassword',
            };

            _.each(opts, function (val, field) {
                if (_.has(fields, field)) {
                    page[fields[field]] = val;
                }
            });
        }
    },

    createInstance: {
        /**
         * Creates a database
         * options.name - instance name
         * options.region - region
         * options.volumeSize - instance volume size
         * options.flavor - instance RAM
         * options.dbName - database name
         * options.dbUsername - username for db user
         * options.password
         * options.confirmPassword
         */
        value: function (options) {
            this.filloutFields(options);
            basePage.disableRxNotifyTimeout();
            this.btnConfirm.click();
        }
    },
});

module.exports = dbaasCreatePage;
