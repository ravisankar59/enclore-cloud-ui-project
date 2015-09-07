var Page = require('astrolabe').Page;
var backupPage = Page.create({
    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/backup';
        }
    },
    newWindowURL: {
        get: function () {
            var ptor = browser.driver;
            return ptor.getAllWindowHandles().then(function (handles) {
                var parentHandle = handles[0];
                var backupHandle = handles[1];
                ptor.switchTo().window(backupHandle);
                return ptor.getCurrentUrl().then(function (url) {
                    ptor.switchTo().window(parentHandle);
                    return url;
                });
            });
        }
    }
});

module.exports = backupPage;