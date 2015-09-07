describe('Service: heat:HeatUtil', function () {

    var heatUtilSvc, environmentSvc;

    var expectedURLs = {
        staging: 'https://heat-ui.rs-heat.com/auth/creds/',
        production: 'https://heat.rackspace.com/auth/creds/'
    };

    beforeEach(function () {
        module('heat');
        module(function ($provide) {
            $provide.factory('Environment', function () {
                return environmentSvc;
            });
        });

        environmentSvc = {
            isUnifiedProd: sinon.stub(),
            isPreProd: sinon.stub(),
            isUnifiedPreProd: sinon.stub(),
            isLocal: sinon.stub()
        };

        inject(function (HeatUtil) {
            heatUtilSvc = HeatUtil;
        });

    });

    it('returns the correct url for PROD environment', function () {
        environmentSvc.isUnifiedProd.returns(true);
        expect(heatUtilSvc.url()).to.equal(expectedURLs.production);
    });

    it('returns the correct url for PREPROD environment', function () {
        environmentSvc.isUnifiedProd.returns(false);
        environmentSvc.isPreProd.returns(true);
        expect(heatUtilSvc.url()).to.equal(expectedURLs.production);
    });

    it('returns the correct url for STAGING environment', function () {
        environmentSvc.isUnifiedPreProd.returns(true);
        expect(heatUtilSvc.url()).to.equal(expectedURLs.staging);
    });

    it('returns the correct url for STAGING environment', function () {
        environmentSvc.isUnifiedProd.returns(false);
        environmentSvc.isPreProd.returns(false);
        environmentSvc.isUnifiedPreProd.returns(false);
        environmentSvc.isLocal.returns(true);
        expect(heatUtilSvc.url()).to.equal(expectedURLs.staging);
    });
});
