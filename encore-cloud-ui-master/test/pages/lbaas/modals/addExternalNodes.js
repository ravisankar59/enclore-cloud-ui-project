var addExternalNodes = {

    setupExternalNodeElements:  {
        value: function (idx, field, val) {
            var txtField = $('#' + field + idx);
            if (!_.isEmpty(val)) {
                txtField.clear();
                txtField.sendKeys(val);
            }
        }
    },

    btnAddMoreNode: {
        get: function () { return element(by.cssContainingText('.node-table a', 'Add More...')); }
    },

    btnDeleteExternalNode: {
        value: function (idx) {
            return $('#lbaasExternalNodeDelete' + idx);
        }
    },

    filloutFields: {
        value: function (lb) {
            var page = this;
            var fields = {
                externalNodeAddress: 'lbaasExternalNodeAddress',
                externalNodePort: 'lbaasExternalNodePort'
            };
            var index = 0;
            _.forEach(lb, function (single) {
                _.each(single, function (val, field) {
                    if (_.has(fields, field)) {
                        var fieldName = fields[field];
                        page.setupExternalNodeElements(index, fieldName, val);
                    }
                });
                index++;
            });
        }
    }
};

module.exports = encore.rxModalAction.initialize(addExternalNodes);