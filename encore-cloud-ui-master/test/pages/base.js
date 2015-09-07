var _ = require('lodash');
var Page = require('astrolabe').Page;

var base = Page.create({
    // This page is used for common components across the site (think: header, footer, sidebar)

    userDetails: {
        // Sidebar
        get: function () { return $('.rx-app-key-accountLvlTools .current-search'); }
    },

    userProducts: {
        get: function () { return $('.active .rx-app-key-cloud'); }
    },

    modalConfirmButton: {
        get: function () { return $('button.submit'); }
    },

    modalCancelButton: {
        get: function () { return $('button.cancel'); }
    },

    pageTitle: {
        get: function () { return $('.page-titles .page-title').getText(); }
    },

    pageSubtitle: {
        get: function () { return $('.page-titles .page-subtitle').getText(); }
    },

    // ignores preprod warning
    warningNotification: {
        get: function () { return $('.rx-notifications:not(.preprod) .notification-warning').getText(); }
    },

    accountInfoElement: {
        get: function () { return $('rx-account-info'); }
    },

    accountInfoBanner: {
        get: function () { return encore.rxAccountInfo.initialize(this.accountInfoElement); }
    },

    isInMidwayEnvironment: {
        value: function () {
            if (/encore.rackspace.com/.test(this.driver.baseUrl)) {
                return false;
            }
            return true;
        }
    },

    actionBtn: {
        value: function (btnText) {
            return {
                get: function () { return element(by.cssContainingText('a', btnText)); }
            };
        }
    },

    setItemsPerPage: {
        value: function (items) {
            // #TODO: evaluate is bad, and I should feel bad.
            var elePagination = element(by.css('div.rx-paginate'));
            elePagination.isPresent().then(function (isPresent) {
                if (isPresent) {
                    elePagination.evaluate('pager.itemsPerPage = ' + items);
                    elePagination.evaluate('$apply()');
                }
            });

        }
    },

    selectItem: {
        // Helper for clicking specific element within collection
        // collection: any parent of elements, e.g. select
        // tagType: tag name of elements to search
        // item: text of desired item. If the item is empty nothing
        //  will be selected
        value: function (collection, tagName, item) {
            if (_.isEmpty(item)) { return; }

            var xp = '//' + tagName + '[text() = "' + item + '"]';
            collection.element(by.xpath(xp)).click();
        }
    },

    dismissPageStatus: {
        // Dismisses all status messages on a page.
        value: function () {
            //uncomment after https://github.com/angular/protractor/pull/1296 is released
            // $$('button.notification-dismiss').each().click();
            // #TODO: Replace with encore.rxNotify
            return $$('button.notification-dismiss').then(function (closeIcons) {
                closeIcons.reverse();
                _.each(closeIcons, function (closeIcon) {
                    closeIcon.click();
                });
            });
        }
    },

    disableRxNotifyTimeout: {
        // Disable rxNotify automatic timeouts until the next page reload
        // This is necessary for tests that trigger an action which refreshes or
        // reloads the page, as it triggers a race condition where the reload needs
        // to finish before the message auto-dismisses, or the message is never seen.
        // There is no drawback to using this after every page reload.
        value: function () {
            var disableTimeout = function () {
                var injector = angular.element(document.body).injector();
                var rxNotify = injector.get('rxNotify');
                var override = function (text, options) {
                    delete options.timeout;
                    return this.oldAdd(text, options);
                };

                // If there's no override in place, set it
                if (!rxNotify.oldAdd) {
                    rxNotify.oldAdd = rxNotify.add;
                    rxNotify.add = override;
                }
            };

            return browser.executeScript(disableTimeout);
        }
    },

    enableRxNotifyTimeout: {
        // Counterpart to the above function, for re-enabling timeouts
        value: function () {
            var enableTimeout = function () {
                var injector = angular.element(document.body).injector();
                var rxNotify = injector.get('rxNotify');

                // If there's an override in place, remove it
                if (rxNotify.oldAdd) {
                    rxNotify.add = rxNotify.oldAdd;
                    delete rxNotify.oldAdd;
                }
            };

            return browser.executeScript(enableTimeout);
        }
    },

    toggleRxSelectElement: {
        value: function (type, toogleBool) {
            var checkElement = element(by.css('rx-select-option[value="' + type + '"] *[type="checkbox"]'));

            checkElement.isSelected().then(function (selected) {
                if (selected !== toogleBool) {
                    checkElement.click();
                } else {
                    if (type === 'all' && !toogleBool) {
                        browser.actions().doubleClick(checkElement).perform();
                    }
                }
            });
        }
    },

    newWindowUrl: {
        // Function to retrieve the URL from a new window, which may or may not have angularJS bindings.
        // This function wraps the promise returned by getAllWindowHandles via browser.wait to wait up to
        // 30 seconds for the window to open.
        get: function () {
            var timeout = 30000;
            var windowHandles = [];

            return browser.wait(function () {
                return browser.getAllWindowHandles().then(function (handles) {
                    windowHandles = handles;
                    return (windowHandles.length === 2 &&
                        windowHandles[1] &&
                        windowHandles[1] !== '');
                });
            }, timeout)
            .then(function () {
                var parentWindow = windowHandles[0];
                var newWindow = windowHandles[1];
                return browser.switchTo().window(newWindow).then(function () {
                    var newWindowUrl = browser.driver.getCurrentUrl();
                    browser.driver.close();
                    browser.switchTo().window(parentWindow);
                    return newWindowUrl;
                });
            });
        }
    }

});

base.breadcrumbs = Page.create(require('./base/breadcrumbs'));
base.feedback = Page.create(require('./base/feedbackForm'));
base.modal = Page.create(require('./base/modal'));
module.exports = base;
