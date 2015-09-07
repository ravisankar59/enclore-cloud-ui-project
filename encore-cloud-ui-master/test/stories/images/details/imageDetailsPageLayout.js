var imageDetailsPage = require('../../../pages/images/details');
var commonTests = require('../../common');

describe('Image Details Page - Page Layout', function () {

    var user = ptor.params.user;
    before(function () {
        imageDetailsPage.open();
    });

    var expected = {
        url: ptor.baseUrl + imageDetailsPage.url,
        breadcrumbs: ['Home', 'User ' + user, 'Images', 'Image Details'],
        title: 'Image Details:',
        display: {
            'user products sidebar': basePage.userProducts,
            'user details sidebar': basePage.userDetails,
            'image details table': imageDetailsPage.table,
            'Account Info Banner': basePage.accountInfoBanner
        },
        table: {
            object: imageDetailsPage.metadata,
            hasFloatingHeader: true,
            sort: {
                columns: {
                    'Key': 'Key'
                }
            }
        }
    };

    commonTests(expected);

    describe('Midway Tests', function () {
        var timePattern = /Jan \d{1,2}, 2014 @ \d{1,2}:\d{2} \(UTC[-+]\d{4}\)/;
        var imageDetails = 'ORD/547a46bd-d913-4bf7-ac35-2f24f25f1b7a';
        var emptyImageDetails = 'ORD/afb5ee19-4e6e-42c3-841c-9663e99b83ba';
        before(function () {
            basePage.setItemsPerPage(50);
        });
        
        it('should show the correct image details @dev', function () {
            imageDetailsPage.go(imageDetails);
            imageDetailsPage.table.data().then(function (details) {
                expect(details[0]).to.eql('Image ID:\n547a46bd-d913-4bf7-ac35-2f24f25f1b7a');
                expect(details[1]).to.eql('Region:\nORD');
                expect(details[2]).to.eql('Status:\nActive');
                expect(details[3]).to.eql('Visibility:\nPrivate');
                expect(details[4]).to.eql('Size:\n255.813879 MB');
                expect(details[5]).to.match(timePattern).to.contain('Created:\n');
                expect(details[6]).to.match(timePattern).to.contain('Last Updated:\n');
                expect(details[7]).to.eql('Base Image:\nafb5ee19-4e6e-42c3-841c-9663e99b83ba');
            });
        });
        
        it('should show N/A for empty fields @dev', function () {
            imageDetailsPage.go(emptyImageDetails);
            imageDetailsPage.table.data().then(function (emptyDetails) {
                expect(emptyDetails[0]).to.eql('Image ID:\nN/A');
                expect(emptyDetails[1]).to.eql('Region:\nN/A');
                expect(emptyDetails[2]).to.eql('Status:\nN/A');
                expect(emptyDetails[3]).to.eql('Visibility:\nN/A');
                expect(emptyDetails[4]).to.eql('Size:\nN/A');
                expect(emptyDetails[5]).to.eql('Created:\nN/A');
                expect(emptyDetails[6]).to.eql('Last Updated:\nN/A');
            });
        });

        it('should show the correct metadata @dev', function () {
            imageDetailsPage.go(imageDetails);
            imageDetailsPage.metadata.keyValueData().then(function (details) {
                expect(details).to.have.property('auto_disk_config', 'True');
                expect(details).to.have.property('cache_in_nova', 'True');
                expect(details).to.have.property('com.rackspace__1__build_core', '1');
                expect(details).to.have.property('com.rackspace__1__build_managed', '1');
                expect(details).to.have.property('com.rackspace__1__build_rackconnect', '1');
                expect(details).to.have.property('com.rackspace__1__options', '0');
                expect(details).to.have.property('com.rackspace__1__platform_target', 'PublicCloud');
                expect(details).to.have.property('com.rackspace__1__release_build_date', '2015-01-28_18-59-14');
                expect(details).to.have.property('com.rackspace__1__release_id', '204');
                expect(details).to.have.property('com.rackspace__1__release_version', '3');
                expect(details).to.have.property('com.rackspace__1__source', 'kickstart');
                expect(details).to.have.property('com.rackspace__1__visible_core', '1');
                expect(details).to.have.property('com.rackspace__1__visible_managed', '1');
                expect(details).to.have.property('com.rackspace__1__visible_rackconnect', '1');
                expect(details).to.have.property('container_format', 'ovf');
                expect(details).to.have.property('disk_format', 'vhd');
                expect(details).to.have.property('flavor_classes', '*, io1, memory1, compute1, onmetal');
                expect(details).to.have.property('image_type', 'base');
                expect(details).to.have.property('min_disk', '20');
                expect(details).to.have.property('min_ram', '512');
                expect(details).to.have.property('org.openstack__1__architecture', 'x64');
                expect(details).to.have.property('org.openstack__1__os_distro', 'org.centos');
                expect(details).to.have.property('org.openstack__1__os_version', '5.11');
                expect(details).to.have.property('os_distro', 'centos');
                expect(details).to.have.property('owner', '657197');
                expect(details).to.have.property('protected', 'false');
                expect(details).to.have.property('vm_mode', 'xen');
            });
        });
    });

    describe('Smoke Tests', function () {

        it('should have correct headers on metadata table', function () {
            var expectedHeaders = ['Key', 'Value'];
            expect(imageDetailsPage.metadata.metadataHeaders).to.eventually.eql(expectedHeaders);
        });

        it('should have correct rows on details table', function () {
            var expectedLabels = ['Image ID', 'Region', 'Status', 'Visibility',
                                  'Size', 'Created', 'Last Updated', 'Base Image'];

            imageDetailsPage.table.data().then(function (details) {
               
                _.each(expectedLabels, function (label, index) {
                    expect(details[index]).to.contain(label);
                });
            });
        });

        it('should show error message if image not found', function () {
            var msg = 'Error loading Image:';
            ptor.get(ptor.baseUrl + '/cloud/123/bad_wolf/images/ORD/12345');
            expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
        });
    });
});
