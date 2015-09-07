var algorithmModal = {
    radioTableObject: {
        get: function () {
            return encore.rxOptionFormTable.initialize($('rx-option-table[data="algorithmFields.data"]'));
        }
    },

    selectedColumn: {
        value: function (columnName) {
            return this.radioTableObject.selectedRow.cell(columnName).getText();
        }
    },

    columnValues: {
        value: function (column) {
            return element.all(by.css('rx-option-table tr td:nth-of-type(' + column + ')')).getText();
        }
    },

    setAlgorithm: {
        value: function (algorithm) {
            this.radioTableObject.selectByColumnText('Algorithm', algorithm);
        }
    }

};

module.exports = encore.rxModalAction.initialize(algorithmModal);
