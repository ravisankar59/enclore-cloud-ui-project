var _ = require('lodash');
var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var baseModal = require('../../base/modal');

var serversModal = {

    data: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssCloudServersHeaders, this.cssCloudServersRows).then(function (rows) {
                return page.tblCloudServersRows.then(function (rowElements) {
                    return _.map(rows, function (row, index) {
                        var serverCellInfo = (row['Server'].split('\n'));
                        row.name = _.first(serverCellInfo).trim();
                        row.id = serverCellInfo[4].trim();
                        row.details = _.last(serverCellInfo).trim();
                        row.ip = row['IP'];
                        rowElements[index].$('input').then(function (checkbox) {
                            row.checkbox = checkbox;
                        });
                        return row;
                    });
                });
            });
        }
    },

    tblCloudServers: {
        get: function () { return $('.cloud-servers'); }
    },

    cssCloudServersHeaders: {
        get: function () { return 'table.cloud-servers thead th'; }
    },

    cssCloudServersRows: {
        get: function () { return 'table.cloud-servers tbody tr'; }
    },

    cloudServersHeaders: {
        get: function () {
            var headerElements = this.tblCloudServers.$$('thead th');
            var headers = tblUtil.getTableHeaders(headerElements);
            return headers.then(function (resolvedHeaders) {
                var finalHeaders = [];
                _.forEach(resolvedHeaders, function (header, index) {
                    if (index === 0) {
                        finalHeaders.push('checkbox');
                    } else {
                        finalHeaders.push(header);
                    }
                });
                return finalHeaders;
            });
        }
    },

    tblCloudServersRows: {
        get: function () { return $$(this.cssCloudServersRows); }
    },

    addServers: {
        value: function (serverNames) {
            this.data().then(function (serverList) {
                _.each(serverNames, function (serverName) {
                    var listItem = _.find(serverList, { name: serverName });
                    listItem.checkbox.click();
                });
            });
            this.submit();
        }
    },

    addServersIP: {
        value: function (servers) {
            this.data().then(function (serverList) {
                _.each(servers, function (server) {
                    var listItem = _.find(serverList, function (row) {
                        var match = (row.name === server.name);

                        if (server.ipv === 'IPv4') {
                            match = (match && row.ip.indexOf('.') > 1);
                        } else if (server.ipv === 'IPv6') {
                            match = (match && row.ip.indexOf(':') > 1);
                        }

                        return match;
                    });
                    listItem.checkbox.click();
                });
            });
            this.submit();
        }
    },

};

serversModal = baseModal.wrap(serversModal);
module.exports = Page.create(serversModal);
