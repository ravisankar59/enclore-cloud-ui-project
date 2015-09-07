describe('Directive: rxBackup', function () {
    var rootScope, scope, compile, httpBackend, backupDirective, form, inputs, backupUtil,
    getAccountRegionSvc, notifySvc, spy;

    var validTemplate = '<rx-backup></rx-backup>';
    var reachResponse = { token: '12345' };

    beforeEach(function () {
        module('backup');
        module('views/templates/rx-backup.html');
        module(function ($provide) {
            $provide.factory('GetAccountRegion', function () {
                return getAccountRegionSvc;
            });
        });

        getAccountRegionSvc = sinon.stub();

        inject(function ($rootScope, $compile, $httpBackend, BackupUtil, rxNotify) {
            rootScope = $rootScope;
            compile = $compile;
            scope = rootScope.$new();
            httpBackend = $httpBackend;
            backupUtil = BackupUtil;
            notifySvc = rxNotify;
        });

        spy = sinon.spy(notifySvc, 'add');
    });

    describe('404: Impersonation Token Not Retrieved', function () {
        beforeEach(function () {
            // doesnt matter what region it is set as since the response is 404
            getAccountRegionSvc.returns('US');
            httpBackend.whenGET('/api/cloud/users/reach').respond(404, {});
            backupDirective = helpers.createDirective(angular.element(validTemplate), compile, scope);
            form = backupDirective.find('form');
            sinon.stub(form[0], 'submit');
            httpBackend.flush();
        });

        it('should not submit the form', function () {
            expect(form[0].submit.callCount).to.equal(0);
            sinon.assert.calledOnce(spy);
        });
    });

    describe('500: Unknown Error Occurred', function () {
        beforeEach(function () {
            // doesnt matter what region it is set as since the response is 500
            getAccountRegionSvc.returns('US');
            httpBackend.whenGET('/api/cloud/users/reach').respond(500, {});
            backupDirective = helpers.createDirective(angular.element(validTemplate), compile, scope);
            form = backupDirective.find('form');
            sinon.stub(form[0], 'submit');
            httpBackend.flush();
        });

        it('should not submit the form', function () {
            expect(form[0].submit.callCount).to.equal(0);
            sinon.assert.calledOnce(spy);
        });
    });

    describe('Impersonation Token Retrieved', function () {
        beforeEach(function () {
            httpBackend.whenGET('/api/cloud/users/reach').respond(reachResponse);
            backupDirective = helpers.createDirective(angular.element(validTemplate), compile, scope);
            inputs = backupDirective.find('input');
            form = backupDirective.find('form');
            sinon.stub(form[0], 'submit');
            httpBackend.flush();
        });
        
        describe('US: region', function () {
            beforeEach(function () {
                getAccountRegionSvc.returns('US');
            });
            
            it('US: should set the Impersonation Token', function () {
                expect(inputs.filter('[name=token]').val()).to.equal(reachResponse.token);
            });

            it('US: should submit the form', function () {
                sinon.assert.called(form[0].submit);
            });
        });

        describe('UK: region', function () {
            beforeEach(function () {
                getAccountRegionSvc.returns('UK');
            });

            it('UK: should set the Impersonation Token', function () {
                expect(inputs.filter('[name=token]').val()).to.equal(reachResponse.token);
            });

            it('UK: should submit the form', function () {
                sinon.assert.called(form[0].submit);
            });
        });
    });
});