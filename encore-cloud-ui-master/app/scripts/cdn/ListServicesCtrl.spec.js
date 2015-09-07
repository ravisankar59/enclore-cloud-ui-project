describe('CDN: ListServicesCtrl', function () {
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

            ctrl = $controller('ListServicesCtrl', {
                $scope: scope,
                $routeParams: validRouteParams,
                CDNStatus: cdnStatus,
                CDNService: cdnService,
                Status: status
            });
        });//inject
    });//beforeEach

    it('$scope.services should be empty', function () {
        expect(_.isEmpty(scope.services)).to.be.true;
    });

    it('$scope.featureStatus should be expected', function () {
        expect(scope.featureStatus).to.equal('gamma');
    });

    it('$scope.truncateTooltipAfter should be 2', function () {
        expect(scope.truncateTooltipAfter).to.equal(2);
    });

    describe('tooltipFor()', function () {
        var dataArray;

        beforeEach(function () {
            subject = scope.tooltipFor;
        });

        describe('given an empty array', function () {
            beforeEach(function () {
                dataArray = [];
            });

            it('returns empty string', function () {
                expect(subject(dataArray, 'name')).to.equal('');
            });
        });//empty array

        describe('given an array shorter than $scope.truncateTooltipAfter', function () {
            beforeEach(function () {
                dataArray = [{ name: 'rackspace1.com' }];
            });

            it('returns empty string', function () {
                expect(subject(dataArray, 'name')).to.equal('');
            });
        });//short array

        describe('given an array of 3 items', function () {
            beforeEach(function () {
                dataArray = [
                    { name: 'rackspace1.com' },
                    { name: 'rackspace2.com' },
                    { name: 'rackspace3.com' }
                ];
            });

            it('should return 1 item when $scope.truncateTooltipAfter is 2 (default)', function () {
                var expected = '<div>rackspace3.com</div>';
                expect(subject(dataArray, 'name')).to.equal(expected);
            });

            it('should return 2 items when $scope.truncateTooltipAfter is 1', function () {
                scope.truncateTooltipAfter = 1;
                var expected = '<div>rackspace2.com</div><div>rackspace3.com</div>';
                expect(subject(dataArray, 'name')).to.equal(expected);
            });
        });//array of 3 items
    });//tooltipFor()

    describe('hasServices()', function () {
        beforeEach(function () {
            subject = scope.hasServices;
        });

        it('should return false if $scope.services is empty', function () {
            scope.services = [];
            expect(subject()).to.be.false;
        });

        it('should return true if $scope.services is not empty', function () {
            scope.services = ['hiyoo'];
            expect(subject()).to.be.true;
        });
    });//hasServices()

    describe('loadServices()', function () {
        // functionality already tested elsewhere
    });//loadServices()

    describe('loadServicesSuccess()', function () {
        beforeEach(function () {
            sinon.spy(status, 'complete');
            subject = ctrl.loadServicesSuccess;
        });

        it('sets $scope.services to given argument', function () {
            var arg = ['hiyoo'];
            expect(scope.services).to.deep.equal([]);
            subject(arg);
            expect(scope.services).to.equal(arg);
        });

        it('calls Status.complete()', function () {
            sinon.assert.callCount(status.complete, 0);
            subject([]);
            sinon.assert.callCount(status.complete, 1);
        });
    });//loadServicesSuccess()

    describe('loadServicesFailure()', function () {
        beforeEach(function () {
            sinon.spy(status, 'setError');
            subject = ctrl.loadServicesFailure;
        });

        var errObj = {
            data: [{
                error: 403,
                message: 'Something went wrong with CDN, we couldn\'t find the error, please contact this service.'
            }]
        };

        it('resets $scope.services to empty array', function () {
            scope.services = ['hiyoo'];
            subject(errObj);
            expect(scope.services).to.deep.equal([]);
        });

        it('calls Status.setError()', function () {
            sinon.assert.callCount(status.setError, 0);
            subject(errObj);
            sinon.assert.callCount(status.setError, 1);
        });

        describe('given invalid error object', function () {
            var errObj = {
                data: [{
                    error: {}
                }]
            };

            it('calls Status.setError() with expected argument', function () {
                subject(errObj);
                sinon.assert.calledWith(status.setError, 'Error loading CDN Services: unknown error');
            });
        });

        describe('given valid error object', function () {
            var errObj = {
                data: [{
                    error: {
                        code: 403,
                        message: 'uhoh'
                    }
                }]
            };

            it('calls Status.setError() with expected argument', function () {
                subject(errObj);
                sinon.assert.calledWith(status.setError, 'Error loading CDN Services: uhoh');
            });
        });
    });//loadServicesFailure()
});//CDN: ListServicesCtrl
