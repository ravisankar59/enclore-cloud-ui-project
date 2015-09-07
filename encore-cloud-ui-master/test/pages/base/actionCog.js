var Page = require('astrolabe').Page;
var _ = require('lodash');

var actionCog = function (rxActionMenuElement, opts) {
    // opts allows you to change selector values
    // opts.popupSelector: selector for popup container
    // opts.cogSelector: selector for menu link
    // opts.optionsSelector: selector for menu options

    opts = opts || {};
    opts = _.defaults(opts, {
        popupSelector: 'div.action-list',
        cogSelector: 'i.fa-cog',
        optionSelector: 'ul li rx-modal-action span a span.ng-scope, ul li.actions-item a',
    });

    return Page.create({
        expand: {
            value: function () {
                var actionPage = this;
                return this.isCollapsed.then(function (collapsed) {
                    if (collapsed) {
                        actionPage.eleCog.click();
                    }
                    return actionPage.actions;
                });
            }
        },

        collapse: {
            value: function () {
                var actionPage = this;
                this.isExpanded.then(function (expanded) {
                    if (expanded) {
                        actionPage.eleCog.click();
                    }
                });
            }
        },

        isExpanded: {
            get: function () {
                return this.elePopup.isDisplayed();
            }
        },

        isCollapsed: {
            get: function () {
                return this.elePopup.isDisplayed().then(function (displayStatus) {
                    return !displayStatus;
                });
            }
        },

        elePopup: {
            get: function () {
                return rxActionMenuElement.$(opts.popupSelector);
            }
        },

        eleCog: {
            get: function () {
                return rxActionMenuElement.$(opts.cogSelector);
            }
        },

        actions: {
            get: function () {
                return this.elePopup.$$(opts.optionSelector).then(function (options) {
                    var actionOptions = {};
                    _.each(options, function (option) {
                        option.getText().then(function (text) {
                            actionOptions[text] = option;
                        });
                    });

                    return actionOptions;
                });
            }
        }
    });
};

module.exports = actionCog;
