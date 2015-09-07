describe('Service: backup: BackupUtil', function () {
    var backupUtilSvc, enviromentSvc;

    var expectedURLS = {
        staging: {
            US: 'https://clouddrive.rackspace.com/account/racker-login',
            UK: 'https://clouddrive.rackspace.co.uk/account/racker-login'
        },
        production: {
            US: 'https://clouddrive.rackspace.com/account/racker-login',
            UK: 'http://cp.drivesrvr-staging.co.uk/account/racker-login'
        }
    };

    beforeEach(function () {
        module('backup');
        module(function ($provide) {
            $provide.factory('Environment', function () {
                return enviromentSvc;
            });
        });

        enviromentSvc = {
            isUnifiedProd: sinon.stub(),
            isPreProd: sinon.stub(),
            isUnifiedPreProd: sinon.stub(),
            isLocal: sinon.stub()
        };

        inject(function (BackupUtil) {
            backupUtilSvc = BackupUtil;
        });
    });

    describe('USA: Region', function () {
        it('returns correct PROD url', function  () {
            enviromentSvc.isUnifiedProd.returns(true);
            expect(backupUtilSvc.getUrl('US')).to.equal(expectedURLS.production.US);
        });

        it('returns correct PREPROD url', function () {
            enviromentSvc.isUnifiedProd.returns(false);
            enviromentSvc.isPreProd.returns(true);
            expect(backupUtilSvc.getUrl('US')).to.equal(expectedURLS.production.US);
        });

        it('returns correct Staging url', function () {
            enviromentSvc.isUnifiedPreProd.returns(true);
            expect(backupUtilSvc.getUrl('US')).to.equal(expectedURLS.staging.US);
        });

        it('returns correct Staging url', function () {
            enviromentSvc.isUnifiedProd.returns(false);
            enviromentSvc.isPreProd.returns(false);
            enviromentSvc.isUnifiedPreProd.returns(false);
            enviromentSvc.isLocal.returns(true);
            expect(backupUtilSvc.getUrl('US')).to.equal(expectedURLS.staging.US);
        });
    });
    
    describe('UK: Region', function () {
        it('returns correct PROD url', function  () {
            enviromentSvc.isUnifiedProd.returns(true);
            expect(backupUtilSvc.getUrl('UK')).to.equal(expectedURLS.production.UK);
        });

        it('returns correct PREPROD url', function () {
            enviromentSvc.isUnifiedProd.returns(false);
            enviromentSvc.isPreProd.returns(true);
            expect(backupUtilSvc.getUrl('UK')).to.equal(expectedURLS.production.UK);
        });

        it('returns correct Staging url', function () {
            enviromentSvc.isUnifiedPreProd.returns(true);
            expect(backupUtilSvc.getUrl('UK')).to.equal(expectedURLS.staging.UK);
        });

        it('returns correct Staging url', function () {
            enviromentSvc.isUnifiedProd.returns(false);
            enviromentSvc.isPreProd.returns(false);
            enviromentSvc.isUnifiedPreProd.returns(false);
            enviromentSvc.isLocal.returns(true);
            expect(backupUtilSvc.getUrl('UK')).to.equal(expectedURLS.staging.UK);
        });
    });
});