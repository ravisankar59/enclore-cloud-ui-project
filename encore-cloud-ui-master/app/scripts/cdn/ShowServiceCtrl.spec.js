describe('CDN: ShowServiceCtrl', function () {
    var cdnStatus, cdnService, status;
    var scope, ctrl, subject;
    var validRouteParams = {
        user: 'hub_cap',
        accountNumber: '323676'
    };
    var productVersions = {
        'CDN Services': 'gamma'
    };

    beforeEach(function () {
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('cdn');
        module(function ($provide) {
            $provide.constant('PRODUCT_VERSIONS', productVersions);
        });

        inject(function ($controller, $rootScope, CDNStatus, CDNService, Status) {
            scope = $rootScope.$new();
            cdnStatus = CDNStatus;
            cdnService = CDNService;
            status = Status;

            ctrl = $controller('ShowServiceCtrl', {
                $scope: scope,
                $routeParams: validRouteParams,
                CDNStatus: cdnStatus,
                CDNService: cdnService,
                Status: status
            });
        });//inject
    });//beforeEach

    it('$scope.service should be empty', function () {
        expect(_.isEmpty(scope.service)).to.be.true;
    });

    it('$scope.featureStatus should be expected', function () {
        expect(scope.featureStatus).to.equal('gamma');
    });

    describe('$scope.hasRules()', function () {
        beforeEach(function () {
            subject = scope.hasRules;
        });

        it('should be false if "rules" key is not present', function () {
            expect(subject({})).to.be.false;
        });

        it('should be false if "rules" is empty array', function () {
            expect(subject({ rules: [] })).to.be.false;
        });

        it('should be true if "rules" is non empty array', function () {
            expect(subject({ rules: [{}] })).to.be.true;
        });
    });//hasRules()

    describe('loadServiceSuccess()', function () {
        var bareData = {
            name: 'testing123'
        };

        beforeEach(function () {
            sinon.spy(status, 'complete');
            subject = ctrl.loadServiceSuccess;
        });

        it('sets $scope.service to given argument', function () {
            expect(scope.service).to.deep.equal({});
            subject(bareData);
            expect(scope.service).to.equal(bareData);
        });

        it('calls Status.complete()', function () {
            sinon.assert.callCount(status.complete, 0);
            subject(bareData);
            sinon.assert.callCount(status.complete, 1);
        });
    });//loadServiceSuccess()

    describe('loadServiceFailure()', function () {
        beforeEach(function () {
            sinon.spy(status, 'setError');
            subject = ctrl.loadServiceFailure;
        });

        it('resets $scope.service to empty obj', function () {
            scope.service = { name: 'testing123' };
            subject({});
            expect(scope.service).to.deep.equal({});
        });

        it('calls Status.setError()', function () {
            sinon.assert.callCount(status.setError, 0);
            subject({});
            sinon.assert.callCount(status.setError, 1);
        });

        describe('given invalid error object', function () {
            var errObj = {};

            it('calls Status.setError() with expected argument', function () {
                subject(errObj);
                sinon.assert.calledWith(status.setError, 'Error loading CDN Service: unknown error');
            });
        });//given invalid error object

        describe('given valid error object', function () {
            var errObj = {
                error: {
                    message: 'uhoh'
                }
            };

            it('calls Status.setError() with expected argument', function () {
                subject(errObj);
                sinon.assert.calledWith(status.setError, 'Error loading CDN Service: uhoh');
            });
        });//given valid error object
    });//loadServiceFailure()

    describe('loadService()', function () {
        // functionality already tested elsewhere
    });//loadService()
});
