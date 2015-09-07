var Page = require('astrolabe').Page;
var _ = require('lodash');
var rest = require('restler');
var homePage = require('./home.page');
var basePage = require('./base');
var Promise = require('bluebird');

module.exports = Page.create({
    url: {
        get: function () {
            if (basePage.isInMidwayEnvironment()) {
                var redirect = this.driver.params.loginRedirect || 'cloud';
                return '/login/?redirect=' + redirect;
            }
            return '/login/qe-protractor-login';
        }
    },

    txtUsername: {
        get: function () { return $('#username'); }
    },

    txtPassword: {
        get: function () { return $('#token'); }
    },

    btnSubmit: {
        get: function () { return $('.rx-button'); }
    },

    lblInvalidLogin: {
        get: function () { return $('.notification-text'); }
    },

    login: {
        // This function delegates the handling of auto-discovering usernames and passwords for you,
        // depending on where you're trying to log in, and who you're trying to log in as.
        //
        // This allows you to use the same `login()` function, without arguments, everywhere, and
        // still be authenticated as something.
        //
        // If you use this function without arguments on staging, it will grab the first available
        // username and password from `test/secrets.js`, and it will log you in using those.
        //
        // If you use this function with only one argument on staging, it will assume that is the username,
        // look it up in `test/secrets.js` and use the password it finds there.
        //
        // If you use this function with any number of arguments on localhost, it will default any unsupplied
        // arguments with the default mock username/password pair.
        value: function (username, password) {
            var page = this;
            if (basePage.isInMidwayEnvironment()) {
                return;
            }
            page.go();
            return browser.driver.getCurrentUrl().then(function (url) {
                if (!(/login/.test(url))) {
                    return;
                } else if (/staging.encore.rackspace.com/.test(url)) {
                    return page.loginLive(username, password, 'staging');
                } else if (/preprod.encore.rackspace.com/.test(url)) {
                    return page.loginLive(username, password, 'preprod');
                } else if (/encore.rackspace.com/.test(url)) {
                    return page.loginLive(username, password, 'prod');
                } else {
                    return page.loginLocalhost(username, password);
                }
            });
        }
    },

    loginLive: {
        value: function (username, password, env) {
            username = username || _.first(_.keys(this.driver.params.logins));
            password = password || this.driver.params.logins[username];
            return this.loginWithToken(username, password, env);
        }
    },

    loginLocalhost: {
        value: function (username, password) {
            this.go();
            username = username || 'racker';
            password = password || 'pass';
            return this.enterLoginCredentials(username, password);
        }
    },

    enterLoginCredentials: {
        value: function (username, password) {
            this.txtUsername.clear();
            this.txtUsername.sendKeys(username);
            this.txtPassword.clear();
            this.txtPassword.sendKeys(password);
            return this.btnSubmit.click();
        }
    },

    loginWithToken: {
        value: function (username, password, env) {
            var page = this;
            var identityEnv = {
                staging: 'https://staging.identity-internal.api.rackspacecloud.com/v2.0/tokens',
                preprod: 'https://identity-internal.api.rackspacecloud.com/v2.0/tokens',
                prod: 'https://identity-internal.api.rackspacecloud.com/v2.0/tokens'
            };

            var json = {
                'auth': {
                    'RAX-AUTH:domain': {
                        'name': 'Rackspace'
                    },
                    'passwordCredentials': {
                        'username': username,
                        'password': password
                    }
                }
            };
            return new Promise(function (resolve, reject) {
                rest.post(identityEnv[env], {
                    data: JSON.stringify(json),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }).on('complete', function (data, response) {
                    if (response.statusCode === 200) {
                        var addTokenToLocalStorage = function (token) {
                            localStorage.setItem('encoreSessionToken', token);
                        };
                        page.driver.executeScript(addTokenToLocalStorage, JSON.stringify(data));
                        resolve();
                    } else {
                        var msg = 'error authenticating as ' + username + '. Check password.';
                        page.InvalidAuthException.thro(msg);
                        reject();
                    }
                });
            });
        }
    },

    logout: {
        value: function () {
            homePage.navigation.logout();
        }
    },

    InvalidAuthException: {
        get: function () { return this.exception('Invalid staging identity credentials'); }
    },

    isLoggedIn: {
        value: function () {
            this.go();
            return $('rx-app').isPresent();
        }
    },

    switchToUser: {
        value: function (userName, accountNumber) {
            this.driver.params.lastUser = this.driver.params.user;
            this.driver.params.lastAccountNumber = this.driver.params.accountNumber;
            if (accountNumber) {
                this.driver.params.accountNumber = accountNumber;
            }
            this.driver.params.user = userName;
        }
    },

    switchToLastUser: {
        value: function () {
            if (_.has(this.driver.params, 'lastUser')) {
                this.driver.params.user = this.driver.params.lastUser;
                this.driver.params.accountNumber = this.driver.params.lastAccountNumber;
            }
        }
    },

    addRole: {
        value: function (role) {
            var addRoleToToken = function (role) {
                var token = JSON.parse(localStorage.getItem('encoreSessionToken'));
                token.access.user.roles.push({ name: role });
                localStorage.setItem('encoreSessionToken', JSON.stringify(token));
            };
            this.driver.executeScript(addRoleToToken, role);
        }
    },

    removeRole: {
        value: function (role) {
            var removeRoleFromToken = function (role) {
                var token = JSON.parse(localStorage.getItem('encoreSessionToken'));
                _.remove(token.access.user.roles, { name: role });
                localStorage.setItem('encoreSessionToken', JSON.stringify(token));
            };
            this.driver.executeScript(removeRoleFromToken, role);
        }
    }

});
