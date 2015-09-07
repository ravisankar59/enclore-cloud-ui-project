describe('rxDateRange', function () {
    var fixture;
    beforeEach(function () {
        fixture = [{
            start: new moment('02/01/15'),
            end: new moment('02/10/15')
        }, {
            start: new moment('02/11/15'),
            end: new moment('02/20/15')
        }, {
            start: new moment('02/21/15'),
            end: new moment('02/30/15')
        }];
    
        module('rxDateRange');
    });

    describe('rxDateRangeFilter', function () {
        var $filter;
        beforeEach(function () {
            inject(function (_$filter_) {
                $filter = _$filter_;
            });
        });

        it('should filter data based on criteria when both a from and to dates are defined', function () {
            var criteria = {
                fromAttr: 'start',
                toAttr: 'end',
                fromDate: new moment('02/01/15'),
                toDate: new moment('02/20/15')
            };
            
            var results = $filter('rxDateRange')(fixture, criteria);
            expect(results.length).to.equal(1);
        });
    });

    describe('rxDateRangeActions', function () {
        var rxDateRangeActions, scope;
        beforeEach (function () {
            inject(function (_rxDateRangeActions_) {
                rxDateRangeActions = _rxDateRangeActions_;
            });
            
            scope = {
                data: fixture,
                fromDate: '02/01/15',
                toDate: '02/20/15',
                from: 'start',
                to: 'end',
                rxDateRangeForm: {
                    $error: {
                    },
                    fromDate: {
                        $setValidity: sinon.spy()
                    },
                    toDate: {
                        $setValidity: sinon.spy()
                    }
                }
            };
        });

        it('should call $setValidity as false when from date is not valid', function () {
            scope.fromDate = 'a';
            rxDateRangeActions.updateData(scope);
            sinon.assert.calledWith(scope.rxDateRangeForm.fromDate.$setValidity, 'date', false);
        });

        it('should call $setValidity as false when to date is not valid', function () {
            scope.toDate = 'a';
            rxDateRangeActions.updateData(scope);
            sinon.assert.calledWith(scope.rxDateRangeForm.toDate.$setValidity, 'date', false);
        });

        it('should call $setValidity as false when dateRange is not valid', function () {
            scope.toDate = '01/01/15';
            rxDateRangeActions.updateData(scope);
            sinon.assert.calledWith(scope.rxDateRangeForm.fromDate.$setValidity, 'dateRange', false);
            sinon.assert.calledWith(scope.rxDateRangeForm.toDate.$setValidity, 'dateRange', false);
        });

        it('should call $setValidity as true when date is valid', function () {
            rxDateRangeActions.updateData(scope);
            sinon.assert.calledWith(scope.rxDateRangeForm.fromDate.$setValidity, 'date', true);
            sinon.assert.calledWith(scope.rxDateRangeForm.toDate.$setValidity, 'date', true);
        });

        it('should call $setValidity as true when dateRange is valid', function () {
            rxDateRangeActions.updateData(scope);
            sinon.assert.calledWith(scope.rxDateRangeForm.fromDate.$setValidity, 'dateRange', true);
            sinon.assert.calledWith(scope.rxDateRangeForm.toDate.$setValidity, 'dateRange', true);
        });
    });

    describe('rxDateRange', function () {
        var $compile, $rootScope, template, isolateScope, rxDateRangeActions;
        beforeEach(function () {
            module('views/templates/rx-dateRange.html');
            
            inject(function (_$compile_, _$rootScope_, _rxDateRangeActions_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_.$new();
                rxDateRangeActions = _rxDateRangeActions_;
                template = '<rx-date-range></rx-date-range>';
                var element = $compile(angular.element(template))($rootScope);
                $rootScope.$digest();
                isolateScope = element.isolateScope();
            });
        });

        it('should call rxDateRangeActions.updateData when updateData is called.', function () {
            sinon.spy(rxDateRangeActions, 'updateData');
            isolateScope.actions.updateData();
            expect(rxDateRangeActions.updateData.called).to.be.true;
        });
    });
});
