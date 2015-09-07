var _ = require('lodash');

module.exports = {

    tblBreadcrumbs: {
        get: function () { return $$('li[ng-repeat^="breadcrumb"]'); }
    },

    getBreadcrumbs: {
        // You will probably want to refer to the keys of the returned object
        // using accessor notation (i.e., `getBreadcrumbs()["Some Name"]`),
        // since there is a chance one of them will not have a valid object
        // name for dot-attribute notation.
        value: function () {
            var breadcrumbs = {};
            var page = this;
            return this.tblBreadcrumbs.then(function (breadcrumbElements) {
                _.forEach(breadcrumbElements, function (breadcrumbElement, index) {
                    var breadcrumb = page.breadcrumbFromElement(breadcrumbElement, index);
                    return breadcrumb.name.then(function (name) {
                        breadcrumbs[name] = breadcrumb;
                    });
                });
                return breadcrumbs;
            });
        }
    },

    getBreadcrumbNames: {
        value: function () {
            return this.tblBreadcrumbs.all(by.binding('breadcrumb.name')).getText();
        }
    },

    breadcrumbFromElement: {
        // Will transform a breadcrumb web element into a breadcrumb page object.
        value: function (breadcrumbElement, breadcrumbPosition) {
            var page = this;
            return {
                name: page.breadcrumbNameFromElement(breadcrumbElement),
                position: breadcrumbPosition,
                visit: function () { page.breadcrumbVisitFromElement(breadcrumbElement); }
            };
        }
    },

    breadcrumbNameFromElement: {
        value: function (breadcrumbElement) {
            var textElementBinding = by.binding('breadcrumb.name');
            return breadcrumbElement.element(textElementBinding).getText().then(function (text) {
                return text;
            });
        }
    },

    breadcrumbVisitFromElement: {
        value: function (breadcrumbElement) {
            return breadcrumbElement.all(by.css('a')).then(function (links) {
                if (links.length) {
                    links[0].click();
                }
            });
        }
    }

};
