var Page = require('astrolabe').Page;
var basePage = require('../../base');
var tblUtil = require('../../base/util/tables');

var createVolumePage = {

    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/cbs/volumes/create';
        }
    },

    txtVolumeName: {
        get: function () { return $('input#volumeName'); },
        set: function (name) {
            this.txtVolumeName.clear();
            this.txtVolumeName.sendKeys(name);
        }
    },

    txtVolumeDescription: {
        get: function () { return $('input#volumeDescription'); },
        set: function (description) {
            this.txtVolumeDescription.clear();
            this.txtVolumeDescription.sendKeys(description);
        }
    },

    txtVolumeSize: {
        get: function () { return $('input#volumeSize'); },
        set: function (size) {
            this.txtVolumeSize.clear();
            this.txtVolumeSize.sendKeys(size);
        }
    },

    selVolumeType: {
        get: function () { return $('select#volumeType'); },
        set: function (type) {
            basePage.selectItem(this.selVolumeType, 'option', type);
        }
    },

    selVolumeRegion: {
        get: function () { return $('select#volumeRegion'); },
        set: function (region) {
            basePage.selectItem(this.selVolumeRegion, 'option', region);
        }
    },

    selVolumeRegionDescription: {
        get: function () { return $('rx-form-item[label=Region] div.field-description'); }
    },

    selVolumeSpecifySnapshot: {
        get: function () { return $('select#volumeSpecifySnapshot'); },
        set: function (snapshotSelect) {
            basePage.selectItem(this.selVolumeSpecifySnapshot, 'option', snapshotSelect);
        }
    },

    cssSnapshotsTable: {
        get: function () {
            return 'rx-option-table#volumeSnapshot table.rx-option-table ';
        }
    },

    cssSnapshotsRows: {
        get: function () {
            return this.cssSnapshotsTable + 'tbody tr';
        }
    },

    cssSnapshotsHeaders: {
        get: function () {
            return this.cssSnapshotsTable + 'thead th';
        }
    },

    selVolumeSnapshot: {
        set: function (snapshot) {
            this.snapshotsData().then(function (rows) {
                var snapshotRow = _.find(rows, { id: snapshot });
                if (_.isUndefined(snapshotRow)) {
                    throw new Error('Unable to find a snapshot with the ID "' + snapshot + '"');
                } else {
                    snapshotRow.select();
                }
            });
        }
    },

    tblSnapshotRows: {
        get: function () { return $$(this.cssSnapshotsRows); }
    },

    snapshotsData: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssSnapshotsHeaders, this.cssSnapshotsRows).then(function (tableData) {
                return page.tblSnapshotRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        var nameAgeSplit = row['Name/ID'].split('\n');
                        if (nameAgeSplit.length === 2) {
                            row.name = (nameAgeSplit[0]).trim();
                            row.id = (nameAgeSplit[1]).trim();
                        } else {
                            row.name = '';
                            row.id = (nameAgeSplit[0]).trim();
                        }

                        var createdAgeSplit = row['Created/Age'].split('\n');
                        /* jshint camelcase:false */
                        if (createdAgeSplit.length === 2) {
                            row.created = createdAgeSplit[0].trim();
                            row.age = encore.rxAge.toMoment((createdAgeSplit[1]).trim());
                        } else {
                            row.created = '';
                            row.age = '';
                        }

                        rows[index].$('td input').then(function (input) {
                            row.select = input.click;
                        });
                        return row;
                    });
                });
            });
        }
    },

    findSnapshot: {
        value: function (snapshot) {
            return this.snapshotsData().then(function (rows) {
                var snapshotRow = _.find(rows, { id: snapshot });
                if (_.isUndefined(snapshotRow)) {
                    throw new Error('Unable to find a snapshot with the ID "' + snapshot + '"');
                } else {
                    return snapshotRow;
                }
            });
        }
    },

    snapshotsHeaders: {
        get: function () { return tblUtil.getTableHeaders($$(this.cssSnapshotsHeaders)); }
    },

    btnCreateVolume: {
        get: function () { return $('button.submit'); }
    },

    btnCancelVolume: {
        get: function () { return $('button.cancel'); }
    },

    filloutFields: {
        value: function (opts) {
            var page = this;
            var fields = {
                name: 'txtVolumeName',
                description: 'txtVolumeDescription',
                type: 'selVolumeType',
                size: 'txtVolumeSize',
                region: 'selVolumeRegion',
                specifySnapshot: 'selVolumeSpecifySnapshot',
                snapshot: 'selVolumeSnapshot'
            };

            // Set type first to avoid clearing size field
            if (opts.type) {
                page[fields['type']] = opts.type;
                fields.type = undefined; // unset so it doesn't try to set twice.
            }
            _.each(opts, function (val, field) {
                if (_.has(fields, field)) {
                    page[fields[field]] = val;
                }
            });
        }
    },

    createVolume: {
        /**
         * Creates volume on create page
         * volume.name: volume name
         * volume.description: volume description
         * volume.size: volume size
         * volume.type: type of volume (sata, ssd)
         * volume.region: region to create volume
         */
        value: function (volume) {
            this.filloutFields(volume);
            this.btnCreateVolume.click();
        }
    }
};

module.exports = Page.create(createVolumePage);
