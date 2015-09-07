var Page = require('astrolabe').Page;
var heatPage = Page.create({
    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/heat';
        }
    },
    newWindowURL: {
        get: function () {
            var ptor = browser.driver;
            return ptor.getAllWindowHandles().then(function (handles) {
                var parentHandle = handles[0];
                var heatHandle = handles[1];
                ptor.switchTo().window(heatHandle);
                return ptor.getCurrentUrl().then(function (url) {
                    ptor.switchTo().window(parentHandle);
                    return url;
                });
            });
        }
    }
});

module.exports = heatPage;
