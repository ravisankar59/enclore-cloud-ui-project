var createVolumePage = require('../../../../pages/cbs/volumes/create');
var volumesOverviewPage = require('../../../../pages/cbs/volumes/overview');
var tf = require('../../../../pages/test-fixtures/ui');

describe('Block Storage Volumes - Create Actions', function () {

    describe('Midway Tests', function () {

        beforeEach(function () {
            createVolumePage.go();
            basePage.disableRxNotifyTimeout();
        });

        it('should allow you to create a volume @dev', function () {
            var volumesOverviewUrl = ptor.baseUrl + volumesOverviewPage.url;
            var volume = {
                name: 'Volume-30',
                description: '',
                size: '111',
                type: 'SATA',
                region: 'DFW (Dallas)'
            };

            createVolumePage.createVolume(volume);
            expect(createVolumePage.currentUrl).to.eventually.equal(volumesOverviewUrl);
        });

        it('should allow you to create a volume from snapshot @dev', function () {
            var volumesOverviewUrl = ptor.baseUrl + volumesOverviewPage.url;
            var volume = {
                name: 'test',
                description: '',
                size: '100',
                type: 'SATA',
                region: 'ORD (Chicago)',
                specifySnapshot: 'Select a snapshot',
                snapshot: '22f1ad21-9986-4cbb-bdb2-52ef73bf2024'
            };
            
            createVolumePage.createVolume(volume);
            expect(createVolumePage.currentUrl).to.eventually.equal(volumesOverviewUrl);
        });

        it('should show error if volume creation failed @dev', function () {
            var volume = {
                name: 'fail',
                description: '',
                size: '111',
                type: 'SATA',
                region: 'ORD (Chicago)'
            };

            createVolumePage.createVolume(volume);
            expect(encore.rxNotify.all.exists('Error')).to.eventually.be.true;
        });

    });

    describe('Regression Tests', function () {

        beforeEach(function () {
            createVolumePage.go();
            basePage.disableRxNotifyTimeout();
        });

        it('should create a SATA Volume #regression', function () {
            var query = { name: tf.sataVolumeNew.name };
            var filter = query.name;

            createVolumePage.createVolume(tf.sataVolumeNew);

            expect(encore.rxNotify.all.exists('Volume created')).to.eventually.be.true;

            volumesOverviewPage.table.findVolume(query, filter).then(function (volumeRow) {
                expect(volumeRow.name).to.eql(tf.sataVolumeNew.name);
                expect(volumeRow.Type).to.eql(tf.sataVolumeNew.type);
            });
        });

        it('should create a SSD Volume #regression', function () {
            var query = { name: tf.ssdVolumeNew.name };
            var filter = query.name;

            createVolumePage.createVolume(tf.ssdVolumeNew);

            expect(encore.rxNotify.all.exists('Volume created')).to.eventually.be.true;

            volumesOverviewPage.table.findVolume(query, filter).then(function (volumeRow) {
                expect(volumeRow.name).to.eql(tf.ssdVolumeNew.name);
                expect(volumeRow.Type).to.eql(tf.ssdVolumeNew.type);
            });
        });

    });

    describe('Smoke Tests', function () {

        var volume;
        beforeEach(function () {
            volume = {
                name: 'auto-testVolume',
                description: 'Test Volume',
                size: '100',
                type: 'SSD',
                region: 'ORD (Chicago)'
            };
            createVolumePage.go();
            basePage.disableRxNotifyTimeout();
        });

        it('should not allow create without Volume Name populated', function () {
            volume.name = '';

            createVolumePage.filloutFields(volume);
            expect(createVolumePage.btnCreateVolume.isEnabled()).to.eventually.be.false;
        });

        it('should not allow create without Volume Size populated', function () {
            volume.size = '';

            createVolumePage.filloutFields(volume);
            expect(createVolumePage.btnCreateVolume.isEnabled()).to.eventually.be.false;
        });

        it('should allow create for valid SSD volume size', function () {
            volume.size = 50;
            createVolumePage.filloutFields(volume);
            expect(createVolumePage.btnCreateVolume.isEnabled()).to.eventually.be.true;

            volume.size = 1024;
            createVolumePage.filloutFields(volume);
            expect(createVolumePage.btnCreateVolume.isEnabled()).to.eventually.be.true;
        });

        it('should allow create for valid SATA volume size', function () {
            volume.type = 'SATA';
            volume.size = 75;
            createVolumePage.filloutFields(volume);
            expect(createVolumePage.btnCreateVolume.isEnabled()).to.eventually.be.true;

            volume.size = 1024;
            createVolumePage.filloutFields(volume);
            expect(createVolumePage.btnCreateVolume.isEnabled()).to.eventually.be.true;
        });

        it('should not allow create for invalid SSD volume size', function () {
            volume.size = 49;
            createVolumePage.filloutFields(volume);
            expect(createVolumePage.btnCreateVolume.isEnabled()).to.eventually.be.false;

            volume.size = 1025;
            createVolumePage.filloutFields(volume);
            expect(createVolumePage.btnCreateVolume.isEnabled()).to.eventually.be.false;
        });

        it('should not allow create for invalid SATA volume size', function () {
            volume.type = 'SATA';
            volume.size = 74;
            createVolumePage.filloutFields(volume);
            expect(createVolumePage.btnCreateVolume.isEnabled()).to.eventually.be.false;

            volume.size = 1025;
            createVolumePage.filloutFields(volume);
            expect(createVolumePage.btnCreateVolume.isEnabled()).to.eventually.be.false;
        });

        it('should allow you to cancel out of Volume Create', function () {
            expect(createVolumePage.btnCancelVolume.isDisplayed()).to.eventually.be.true;
            createVolumePage.btnCancelVolume.click();
            expect(createVolumePage.currentUrl).to.eventually.equal(ptor.baseUrl + volumesOverviewPage.url);
        });

    });
});
