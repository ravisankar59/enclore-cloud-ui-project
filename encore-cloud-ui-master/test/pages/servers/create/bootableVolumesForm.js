var Page = require('astrolabe').Page;

var bootableVolumesForm = {
    rootElement: {
        get: function () {
            return $('#bootableVolumeFields_' + this.currentFlavor);
        },
        set: function (flavor) {
            this.currentFlavor = flavor;
        }
    },

    lblBootSource: {
        get: function () { return this.rootElement.$('rx-form-item[label="Boot Source"] label.field-label'); }
    },

    eleBootSource: {
        get: function () { return this.rootElement.$('rx-form-item[label="Boot Source"] select#boot'); }
    },

    eleBootIndex: {
        get: function () { return this.rootElement.$('rx-form-item[label="Boot Index"]'); }
    },

    eleVolumeSize: {
        get: function () { return this.rootElement.$('rx-form-item[label="Volume Size"]'); }
    },

    eleSourceType: {
        get: function () { return this.rootElement.$('rx-form-item[label="Source Type"]'); }
    },

    eleDestinationType: {
        get: function () { return this.rootElement.$('rx-form-item[label="Destination Type"]'); }
    },

    eleDeleteOnTermination: {
        get: function () { return this.rootElement.$('rx-form-item[label="Delete on Termination?"]'); }
    },

    selectBootSource: {
        value: function (bootOpt) {
            this.eleBootSource.$('option[value="' + bootOpt + '"]').click();
        }
    },

    eleBootableVolumeContainer: {
        get: function () { return this.rootElement.$('div.flex-container'); }
    },

};

module.exports = {
    initialize: function (flavor) {
        var form = Page.create(bootableVolumesForm);
        form.rootElement = flavor;

        return form;
    }
};
