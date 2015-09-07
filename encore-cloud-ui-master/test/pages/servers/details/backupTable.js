var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var basePage = require('../../base');

module.exports = Page.create({

    frmRxModal: {
        get: function () { return $('rx-modal-form'); }
    },

    cssBackupsTable: {
        get: function () { return 'table.server-backup-schedule '; }
    },

    cssBackupHeaders: {
        get: function () { return this.cssBackupsTable + 'thead th'; }
    },

    cssBackupRows: {
        get: function () { return this.cssBackupsTable + 'tbody tr '; }
    },

    tblBackupHeaders: {
        get: function () { return $$(this.cssBackupHeaders); }
    },

    tblBackupRows: {
        get: function () { return $$(this.cssBackupRows); }
    },

    element: {
        get: function () { return $(this.cssBackupsTable); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders(this.tblBackupHeaders); }
    },

    backups: {
        get: function () {
            return tblUtil.getTableData(this.cssBackupHeaders, this.cssBackupRows).then(function (backup) {
                return backup[0];
            });
        }
    },

    btnUpdateBackup: {
        get: function () { return $('rx-modal-action[template-url="updateBackupSchedule.html"] a.modal-link '); }
    },

    btnDisableBackup: {
        get: function () { return $('rx-modal-action[template-url="disableSchedule.html"] a.modal-link '); }
    },

    enableBackup: {
        // Accepts the start time and end for the daily backups as strings in the 24-hour format.
        // For instance, to set a backup schedule for midnight to 2am on Wednesdays, use
        // var backupSchedule = {
        //     daily: {
        //         start: '1000',
        //         end: '1200'
        //     },
        //     weekly: 'friday'
        // };
        // page.enableBackup(backupSchedule);`
        value: function (backup) {
            var weekday = backup.weekly.toUpperCase();
            var daily = backup.daily;
            if (typeof daily === 'string') {
                daily = daily.toUpperCase();
            } else {
                daily = ['H', daily.start, daily.end].join('_');
            }
            var dailySelector = 'select#daily option[value="' + daily + '"]';
            var weeklySelector = 'select#weekly option[value="' + weekday + '"]';
            this.btnUpdateBackup.click();
            this.frmRxModal.$(dailySelector).click();
            this.frmRxModal.$(weeklySelector).click();
            basePage.modalConfirmButton.click();
        }
    },

    disableBackup: {
        value: function () {
            this.btnDisableBackup.click();
            basePage.modalConfirmButton.click();
        }
    },
});
