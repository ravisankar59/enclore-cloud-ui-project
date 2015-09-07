var Page = require('astrolabe').Page;
var basePage = require('../base');

var page = {

    url: {
        get: function  () {
            var user = ptor.params.user;
            var accountNumber = ptor.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/networks/create';
        }
    },

    filloutFields: {
        value: function (opts) {
            var page = this;
            var fields = {
                name: 'txtName',
                region: 'selRegion',
                cidr: 'txtCidr'
            };

            _.each(opts, function (val, field) {
                if (_.has(fields, field)) {
                    page[fields[field]] = val;
                }
            });
        }
    },

    createNetwork: {
        value: function (opts) {
            // opts.name: network name
            // opts.region: region where network should be created
            // opts.cidr: Netowrks CIDR
            this.filloutFields(opts);
            return this.btnSubmit.click();
        }
    },

    lblName: {
        get: function () { return $('rx-form-item[label="Name"] span.field-label'); }
    },

    lblRegion: {
        get: function () { return $('rx-form-item[label="Region"] span.field-label'); }
    },

    lblCidr: {
        get: function () { return $('rx-form-item[label="CIDR"] span.field-label'); }
    },

    txtName: {
        get: function () { return element(by.id('name')); },
        set: function (name) {
            this.txtName.clear();
            this.txtName.sendKeys(name);
        }
    },

    selRegion: {
        get: function () { return element(by.id('region')); },
        set: function (region) {
            basePage.selectItem(this.selRegion, 'option', region);
        }
    },

    txtCidr: {
        get: function () { return element(by.id('cidr')); },
        set: function (cidr) {
            this.txtCidr.clear();
            this.txtCidr.sendKeys(cidr);
        }
    },

    btnSubmit: {
        get: function () { return element(by.id('btnCreateNetwork')); }
    },

    btnCancel: {
        get: function () { return element(by.id('btnCancelNetwork')); }
    }
};

module.exports = Page.create(page);
