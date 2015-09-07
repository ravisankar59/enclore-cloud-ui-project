var addAccessControlRules = {
    btnAddMoreNode: {
        get: function () { return element(by.cssContainingText('.node-table a', 'Add More...')); }
    },
    btnDeleteAccessRule: {
        value: function (index) {
            return $('#removeAccessLink' + index);
        }
    },
    cssInputHost: {
        value: function (index) {
            return $('#ruleHost' + index);
        }
    },
    filloutFields: {
        value: function (index, ip) {
            var page = this;
            var inputHost = page.cssInputHost(index);
            inputHost.clear();
            inputHost.sendKeys(ip);
        }
    }
};

module.exports = encore.rxModalAction.initialize(addAccessControlRules);