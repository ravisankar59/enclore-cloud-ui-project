var dbaasCreatePage = require('../../../pages/dbaas/create');
var dbaasOverviewPage = require('../../../pages/dbaas/overview');
var tf = require('../../../pages/test-fixtures/ui');

describe('Database Create Page - Database Creation', function () {
    var regions = {
        preprod: 'ORD (Chicago)',
        staging: 'STAGING (Staging)',
        localhost: 'STAGING (Staging)'
    };
    var region = regions[ptor.params.env];

    before(function () {
        dbaasCreatePage.go();
    });

    describe('Midway Tests', function () {

        it('should allow user to submit if name, region, volume, flavor are provided @dev', function () {
            var instance = {
                name: 'testInstance',
                region: region,
                volumeSize: '2',
                flavor: '512MB'
            };

            dbaasCreatePage.filloutFields(instance);

            expect(dbaasCreatePage.btnConfirm.isEnabled()).to.eventually.be.true;
        });

        it('should allow user to submit if name, region, volume, flavor, db name are provided @dev', function () {
            var instance = {
                name: 'testInstance',
                region: region,
                volumeSize: '2',
                flavor: '512MB',
                dbName: 'testDatabase'
            };

            dbaasCreatePage.filloutFields(instance);

            expect(dbaasCreatePage.btnConfirm.isEnabled()).to.eventually.be.true;
        });

        it('should submit if name, region, volume, flavor, db name and password are provided @dev', function () {
            var instance = {
                name: 'testInstance',
                volumeSize: '2',
                dbName: 'testDatabase'
            };

            dbaasCreatePage.filloutFields(instance);

            expect(dbaasCreatePage.btnConfirm.isEnabled()).to.eventually.be.true;
        });

        it('should not show password fields if username not provided @dev', function () {
            expect(dbaasCreatePage.txtPassword.isDisplayed()).to.eventually.be.false;
            expect(dbaasCreatePage.txtConfirmPassword.isDisplayed()).to.eventually.be.false;
        });

        it('should display password fields after entering username @dev', function () {
            var instance = {
                name: 'testInstance',
                volumeSize: '2',
                dbName: 'testDatabase',
                dbUsername: 'testUser'
            };

            dbaasCreatePage.filloutFields(instance);

            expect(dbaasCreatePage.txtPassword.isDisplayed()).to.eventually.be.true;
            expect(dbaasCreatePage.txtConfirmPassword.isDisplayed()).to.eventually.be.true;
            expect(dbaasCreatePage.btnConfirm.isEnabled()).to.eventually.be.false;
        });

        it('should submit if password is entered @dev', function () {
            var instance = {
                name: 'testInstance',
                volumeSize: '2',
                dbName: 'testDatabase',
                dbUsername: 'testUser',
                password: 'password',
                confirmPassword: 'password'
            };

            dbaasCreatePage.filloutFields(instance);

            expect(dbaasCreatePage.btnConfirm.isEnabled()).to.eventually.be.true;
        });

        it('should submit if username is cleared out after entered @dev', function () {
            var instance = {
                name: 'testInstance',
                volumeSize: '2',
                dbName: 'testDatabase',
                dbUsername: 'testUser',
                password: 'password',
                confirmPassword: 'password'
            };

            dbaasCreatePage.filloutFields(instance);
            dbaasCreatePage.txtUsername.clear();

            expect(dbaasCreatePage.txtPassword.isDisplayed()).to.eventually.be.false;
            expect(dbaasCreatePage.txtConfirmPassword.isDisplayed()).to.eventually.be.false;
            expect(dbaasCreatePage.btnConfirm.isEnabled()).to.eventually.be.true;
        });

        it('should allow you to create an instance @dev', function () {
            var overviewUrl = ptor.baseUrl + dbaasOverviewPage.url + '/STAGING/554cdd04-9b30-4555-a5e7-07844e9549d9';
            var instanceOptions = {
                name: 'testInstance',
                region: region,
                volumeSize: '2',
                flavor: '512MB',
                dbName: 'testDatabase',
                dbUsername: 'testUser',
                password: 'password',
                confirmPassword: 'password'
            };

            dbaasCreatePage.go();
            dbaasCreatePage.createInstance(instanceOptions);

            // expect that we're on the overview page after submission
            expect(dbaasCreatePage.currentUrl).to.eventually.equal(overviewUrl);

            // Verify that immediate Create DBaaS Instance result results in the additional info banner
            expect(encore.rxNotify.all.exists('Instance Created.')).to.eventually.be.true;

            expect(basePage.warningNotification).to.eventually.contain('The database instance is being provisioned');

            // Verify that no error banners are displayed
            expect(encore.rxNotify.all.exists('Error')).to.eventually.be.false;
        });

        it('should show error if server creation failed @dev', function () {
            dbaasCreatePage.go();
            var instance = {
                name: 'failwhale',
                volumeSize: '2'
            };

            dbaasCreatePage.createInstance(instance);

            expect(encore.rxNotify.all.exists('Error')).to.eventually.be.true;
        });
    });

    describe('Smoke Tests', function () {

        it('should allow you to cancel out of server creation', function () {
            dbaasCreatePage.go();
            expect(dbaasCreatePage.btnCancel.isDisplayed()).to.eventually.be.true;

            dbaasCreatePage.btnCancel.click();
            expect(dbaasCreatePage.currentUrl).to.eventually.equal(ptor.baseUrl + dbaasOverviewPage.url);
        });
    });

    describe('Regression Tests', function () {

        it('should create a DB Instance without DB #regression', function () {
            dbaasCreatePage.createInstance(tf.dbaasWithoutDb);
            expect(encore.rxNotify.all.exists('Instance Created.')).to.eventually.be.true;
        });

        it('should create a DB Instance with a DB #regression', function () {
            dbaasCreatePage.createInstance(tf.dbaasWithDb);
            expect(encore.rxNotify.all.exists('Instance Created.')).to.eventually.be.true;
        });

        it('should create a DB Instance with a DB and DB User #regression', function () {
            dbaasCreatePage.createInstance(tf.dbaasWithDbAndUser);
            expect(encore.rxNotify.all.exists('Instance Created.')).to.eventually.be.true;
        });
    });
});
