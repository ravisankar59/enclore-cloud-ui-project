var serversCreatePage = require('../../../pages/servers/create');
var serversOverviewPage = require('../../../pages/servers/overview');
var commonTests = require('../../common');

describe('Cloud Servers Create Page', function () {

    describe('Page Layout', function () {
        before(function () {
            serversCreatePage.go();
        });

        var expected = {
            url: ptor.baseUrl + serversCreatePage.url,
            breadcrumbs: ['Home', 'User ' + ptor.params.user, 'Servers', 'Create New Server'],
            title: 'Create a New Cloud Server',
            display: {
                'user products sidebar': basePage.userProducts,
                'user details sidebar': basePage.userDetails,
                'a link to flavors wiki': serversCreatePage.lnkFlavors,
                'a link to calculator': serversCreatePage.lnkCalculator,
                'a link to cloud servers overview': serversCreatePage.lnkCloudServersOverview,
                'submit feedback button': basePage.feedback.btnFeedbackForm,
                'server name textbox': serversCreatePage.txtServerName,
                'region dropdown': serversCreatePage.selRegion
            },
            equal: {
                'server name label | Server Name:': serversCreatePage.lblServerName,
                'region label | Region:': serversCreatePage.lblRegion
            },
            notDisplay: {
                'classic flavor tab': serversCreatePage.tabClassic
            }
        };

        commonTests(expected);

        it('should take you back to the servers page using the breadcrumbs', function () {
            basePage.breadcrumbs.getBreadcrumbs().then(function (breadcrumbs) {
                breadcrumbs['Servers'].visit();
            });

            expect(serversCreatePage.currentUrl).to.eventually.equal(ptor.baseUrl + serversOverviewPage.url);
            serversCreatePage.go();
        });

        it('should have correct url for link to Flavors Wiki', function () {
            var flavorsUrl = 'https://one.rackspace.com/x/7JN0Aw';
            expect(serversCreatePage.lnkFlavorsHref).to.eventually.equal(flavorsUrl);
        });

        it('should have correct url for link to Calculator', function () {
            var calcUrl = 'http://www.rackspace.com/calculator';
            expect(serversCreatePage.lnkCalculatorHref).to.eventually.equal(calcUrl);
        });

        it('should have correct url for link to Cloud Servers Overview', function () {
            var overviewUrl = 'http://www.rackspace.com/cloud/servers';
            expect(serversCreatePage.lnkCloudServersOverviewHref).to.eventually.equal(overviewUrl);
        });
    });

    describe('FirstGen Page Layout', function () {

        before(function () {
            serversCreatePage.openFirstGen();
        });

        var expected = {
            display: {
                'standard flavor tab': serversCreatePage.tabStandard,
                'saved images tab': serversCreatePage.tabSavedImages,
                'rackspace images tab': serversCreatePage.tabRxImages,
            },
            notDisplay: {
                'the networks list': serversCreatePage.tblNetworksList,
            }
        };

        commonTests(expected);

        it('should not have boot source dropdown present', function () {
            var bootForm = serversCreatePage.bootableVolumesForm.initialize('standard');
            expect(bootForm.eleBootSource.isPresent()).to.eventually.be.false;
        });

        describe('rackspace images table:', function () {
            var raxImagesTable = serversCreatePage.rxImagesTable;
            var images = [
                {
                    name: 'CentOS 5 - MGC LAMP',
                    minRam: '',
                    minDisk: '0 GB',
                    createdOn: '10/14/10 12:00 AM' // UTC
                },
                {
                    name: 'CentOS 5 - MGC LAMP - XenServer',
                    minRam: '256 MB',
                    minDisk: '20 GB',
                    createdOn: '5/26/11 2:28 PM' // UTC
                }
            ];

            before(function () {
                serversCreatePage.tabRxImages.click();
            });

            _.forEach(images, function (image) {
                describe('for ' + image.name + ' image', function () {
                    it('should exist @dev', function () {
                        expect(raxImagesTable.containsImage(image.name)).to.eventually.be.true;
                    });

                    it('should show expected Min Disk @dev', function () {
                        expect(raxImagesTable.containsMinDisk(image.name, image.minDisk)).to.eventually.be.true;
                    });

                    it('should show expected Min Ram @dev', function () {
                        expect(raxImagesTable.containsMinRam(image.name, image.minRam)).to.eventually.be.true;
                    });

                    it('should show expected Created On @dev', function () {
                        expect(raxImagesTable.containsCreatedOn(image.name, image.createdOn)).to.eventually.be.true;
                    });
                });
            });

            it('should not show inactive images', function () {
                expect(raxImagesTable.containsStatus('ERROR')).to.eventually.be.false;
            });

        });//rackspace images table

        describe('saved images table:', function () {

            var savedImagesTable = serversCreatePage.savedImagesTable;
            var images = [
                {
                    name: 'CentOS 5 - MGC Base',
                    minRam: '',
                    minDisk: '0 GB',
                    createdOn: '10/14/10 12:00 AM' // UTC from 10/13/10 7:00 PM CDT
                },
                {
                    name: 'CentOS 5 - MGC Base - XenServer',
                    minRam: '256 MB',
                    minDisk: '0 GB',
                    createdOn: '5/26/11 2:29 PM' // UTC from 5/26/11 9:29 AM CDT
                },
                {
                    name: 'test',
                    minRam: '256 MB',
                    minDisk: '0 GB',
                    createdOn: '5/26/11 2:29 PM' // UTC from 5/26/11 9:29 AM CDT
                }
            ];

            before(function () {
                serversCreatePage.tabSavedImages.click();
            });

            _.forEach(images, function (image) {
                describe('for ' + image.name + ' image', function () {
                    it('should exist @dev', function () {
                        expect(savedImagesTable.containsImage(image.name)).to.eventually.be.true;
                    });

                    it('should show expected Min Disk @dev', function () {
                        expect(savedImagesTable.containsMinDisk(image.name, image.minDisk)).to.eventually.be.true;
                    });

                    it('should show expected Min Ram @dev', function () {
                        expect(savedImagesTable.containsMinRam(image.name, image.minRam)).to.eventually.be.true;
                    });

                    it('should show expected Created On @dev', function () {
                        expect(savedImagesTable.containsCreatedOn(image.name, image.createdOn)).to.eventually.be.true;
                    });
                });
            });

            it('should not show inactive images', function () {
                expect(savedImagesTable.containsStatus('ERROR')).to.eventually.be.false;
            });
        });//saved images table

        it.skip('should show saved images table after clicking on saved images tab', function () {
            //There are currently no Saved FirstGen Images in Staging
            var imageName = 'test';

            serversCreatePage.tabSavedImages.click();

            expect(serversCreatePage.savedImagesTable.isDisplayed()).to.eventually.be.true;
            expect(serversCreatePage.savedImagesTable.containsImage(imageName)).to.eventually.be.true;
        });

        it('should show standard vm flavors table after clicking on standard tab', function () {
            serversCreatePage.selectFlavor({
                type: 'standard',
                name: '256 server'
            });

            expect(serversCreatePage.eleStandardFlavorsTable.isDisplayed()).to.eventually.be.true;
        });

        describe('Required Fields:', function () {

            var imageName;

            before(function () {
                var image = {
                    localhost: 'CentOS 5 - MGC LAMP',
                    staging: 'Ubuntu 10.04 LTS - MGC Base',
                    preprod: 'Ubuntu 10.04 LTS',
                    production: 'Ubuntu 10.04 LTS'
                };

                imageName = image[ptor.params.env] || image['staging'];
            });

            beforeEach(function () {
                serversCreatePage.openFirstGen();
            });

            it('should disable "Create a New Server" button if server name is blank', function () {
                var opts = {
                    name: '',
                    image: {
                        type: 'rackspace',
                        name: imageName
                    },
                    flavor: {
                        type: 'standard',
                        name: '256 server'
                    }
                };

                serversCreatePage.filloutFields(opts);

                expect(serversCreatePage.btnCreateServer.isEnabled()).to.eventually.be.false;
            });

            it('should disable "Create a New Server" button if Image is not selected', function () {
                var opts = {
                    name: 'noImageSelected',
                    flavor: {
                        type: 'standard',
                        name: '256 server'
                    }
                };

                serversCreatePage.filloutFields(opts);

                expect(serversCreatePage.btnCreateServer.isEnabled()).to.eventually.be.false;
            });

            it('should disable "Create a New Server" button if Flavor is not selected', function () {
                var opts = {
                    name: 'noFlavorSelected',
                    image: {
                        type: 'rackspace',
                        name: imageName
                    }
                };

                serversCreatePage.filloutFields(opts);

                expect(serversCreatePage.btnCreateServer.isEnabled()).to.eventually.be.false;
            });
        });

    });

    describe('NextGen Page Layout', function () {

        var expected = {
            display: {
                'compute flavor tab': serversCreatePage.tabCompute,
                'saved images tab': serversCreatePage.tabSavedImages,
                'rackspace images tab': serversCreatePage.tabRxImages,
            },
            notPresent: {
                'classic flavor tab': serversCreatePage.tabClassic
            }
        };

        before(function () {
            serversCreatePage.openNextGen();
        });

        commonTests(expected);

        it('should display the proper tabs', function () {
            serversCreatePage.availableFlavorTabs().then(function (flavorTabs) {
                _.each(flavorTabs, function (tab) {
                    expect(tab.isDisplayed()).to.eventually.be.true;
                });
            });
        });

        it('should take you back to the servers page using the breadcrumbs', function () {
            basePage.breadcrumbs.getBreadcrumbs().then(function (breadcrumbs) {
                breadcrumbs['Servers'].visit();
            });

            expect(serversCreatePage.currentUrl).to.eventually.equal(ptor.baseUrl + serversOverviewPage.url);
            serversCreatePage.openNextGen();
        });

        describe('rackspace images table:', function () {
            var raxImagesTable = serversCreatePage.rxImagesTable;
            var images = [
                {
                    name: 'Ubuntu 10.04 LTS (Lucid Lynx)',
                    minRam: '512 MB',
                    minDisk: '0 GB',
                    createdOn: '10/19/13 11:30 PM' // UTC
                },
                {
                    name: 'Windows Server 2012',
                    minRam: '',
                    minDisk: '0 GB',
                    createdOn: '10/16/13 1:11 AM' // UTC
                }
            ];

            before(function () {
                serversCreatePage.tabRxImages.click();
            });

            _.forEach(images, function (image) {
                describe('for ' + image.name + ' image', function () {
                    it('should exist @dev', function () {
                        expect(raxImagesTable.containsImage(image.name)).to.eventually.be.true;
                    });

                    it('should show expected Min Disk @dev', function () {
                        expect(raxImagesTable.containsMinDisk(image.name, image.minDisk)).to.eventually.be.true;
                    });

                    it('should show expected Min Ram @dev', function () {
                        expect(raxImagesTable.containsMinRam(image.name, image.minRam)).to.eventually.be.true;
                    });

                    it('should show expected Created On @dev', function () {
                        expect(raxImagesTable.containsCreatedOn(image.name, image.createdOn)).to.eventually.be.true;
                    });
                });
            });

            it('should not show inactive images', function () {
                expect(raxImagesTable.containsStatus('ERROR')).to.eventually.be.false;
            });
        });//rackspace images table

        describe('saved images table:', function () {

            var savedImagesTable = serversCreatePage.savedImagesTable;
            var images = [
                {
                    name: 'Windows Server 2012',
                    minRam: '512 MB',
                    minDisk: '20 GB',
                    createdOn: '8/9/12 6:45 PM' // UTC from 8/9/12 1:45 PM CDT
                },
                {
                    name: 'Test',
                    minRam: '512 MB',
                    minDisk: '20 GB',
                    createdOn: '10/11/12 3:53 PM' // UTC from 10/11/12 10:53 AM CDT
                }
            ];

            before(function () {
                serversCreatePage.tabSavedImages.click();
            });

            _.forEach(images, function (image) {
                describe('for ' + image.name + ' image', function () {
                    it('should exist @dev', function () {
                        expect(savedImagesTable.containsImage(image.name)).to.eventually.be.true;
                    });

                    it('should show expected Min Disk @dev', function () {
                        expect(savedImagesTable.containsMinDisk(image.name, image.minDisk)).to.eventually.be.true;
                    });

                    it('should show expected Min Ram @dev', function () {
                        expect(savedImagesTable.containsMinRam(image.name, image.minRam)).to.eventually.be.true;
                    });

                    it('should show expected Created On @dev', function () {
                        expect(savedImagesTable.containsCreatedOn(image.name, image.createdOn)).to.eventually.be.true;
                    });
                });
            });

            it('should not show inactive images', function () {
                expect(savedImagesTable.containsStatus('ERROR')).to.eventually.be.false;
            });
        });//saved images table

        it('should show empty field when Min Disk is not present on rackspace images table @dev', function () {
            var imageName = 'Windows Server 2012';
            var minDisk = '';

            serversCreatePage.tabRxImages.click();

            expect(serversCreatePage.rxImagesTable.containsMinRam(imageName, minDisk)).to.eventually.be.true;
        });

        it('should show saved images table after clicking on saved images tab', function () {
            serversCreatePage.tabSavedImages.click();

            expect(serversCreatePage.savedImagesTable.isDisplayed()).to.eventually.be.true;
        });

        it('should show standard vm flavors table after clicking on standard tab', function () {
            serversCreatePage.selectFlavor({
                type: 'standard',
                name: '512MB Standard'
            });

            expect(serversCreatePage.eleStandardFlavorsTable.isDisplayed()).to.eventually.be.true;
        });

        it('should show boot source dropdown', function () {
            var bootForm = serversCreatePage.bootableVolumesForm.initialize('compute');
            expect(bootForm.eleBootSource.isPresent()).to.eventually.be.true;
        });

        describe('Bootable Volumes Form after choosing Create new Bootable Volume', function () {
            var bootForm;
            before(function () {
                bootForm = serversCreatePage.bootableVolumesForm.initialize('compute');
                serversCreatePage.openNextGen();
                bootForm.selectBootSource('new');
            });

            it('should show "Boot Index" field', function () {
                expect(bootForm.eleBootIndex.isPresent()).to.eventually.be.true;
            });

            it('should show "Volume Size" field', function () {
                expect(bootForm.eleVolumeSize.isPresent()).to.eventually.be.true;
            });

            it('should show "Source Type" field', function () {
                expect(bootForm.eleSourceType.isPresent()).to.eventually.be.true;
            });

            it('should show "Destination Type" field', function () {
                expect(bootForm.eleDestinationType.isPresent()).to.eventually.be.true;
            });

            it('should show "Delete On Termination" field', function () {
                expect(bootForm.eleDeleteOnTermination.isPresent()).to.eventually.be.true;
            });
        });

        it('should not show bootable volume fields after choosing Local', function () {
            var bootForm = serversCreatePage.bootableVolumesForm.initialize('general');
            var flavor = {
                type: 'general',
                name: '1 GB General Purpose v1'
            };

            serversCreatePage.openNextGen();

            serversCreatePage.selectFlavor(flavor);
            bootForm.selectBootSource('local');
            expect(bootForm.eleBootableVolumeContainer.isPresent()).to.eventually.be.false;
        });

        it('should have correct headers for VM Flavor table when selecting Performance 1', function () {
            var expectedHeaders = ['', 'Name', 'Ram', 'vCPU', 'System Disk', 'Disk I/O'];
            serversCreatePage.tabPerformance1.click();
            expect(serversCreatePage.flavorHeaders()).to.eventually.eql(expectedHeaders);
        });

        describe('Required Fields:', function () {

            beforeEach(function () {
                serversCreatePage.openNextGen();
            });

            it('should disable "Create a New Server" button if server name is blank', function () {
                var opts = {
                    name: '',
                    image: {
                        type: 'rackspace',
                        name: 'Ubuntu 14.04 LTS (Trusty Tahr) (PV)'
                    },
                    flavor: {
                        type: 'standard',
                        name: '512MB Standard'
                    }
                };

                serversCreatePage.filloutFields(opts);

                expect(serversCreatePage.btnCreateServer.isEnabled()).to.eventually.be.false;
            });

            it('should disable "Create a New Server" button if Image is not selected', function () {
                var opts = {
                    name: 'noImageSelected',
                    flavor: {
                        type: 'standard',
                        name: '512MB Standard'
                    }
                };

                serversCreatePage.filloutFields(opts);

                expect(serversCreatePage.btnCreateServer.isEnabled()).to.eventually.be.false;
            });

            it('should disable "Create a New Server" button if Flavor is not selected', function () {
                var opts = {
                    name: 'noFlavorSelected',
                    image: {
                        type: 'rackspace',
                        name: 'Ubuntu 14.04 LTS (Trusty Tahr) (PV)'
                    }
                };

                serversCreatePage.filloutFields(opts);

                expect(serversCreatePage.btnCreateServer.isEnabled()).to.eventually.be.false;
            });
        });

        describe('Non-managed User:', function () {

            before(function () {
                var region = 'DFW (Dallas)';
                loginPage.switchToUser('encoreqe1');
                serversCreatePage.openNextGen(region);
            });

            after(function () {
                loginPage.switchToUser('hub_cap');
            });

            it('should default to selecting PublicNet for Non-Managed Accounts @nodev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('PublicNet').then(function (checkbox) {
                    expect(checkbox.isSelected()).to.eventually.be.true;
                });
            });

            it('should default to selecting ServiceNet for Non-Managed Accounts @nodev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('ServiceNet').then(function (checkbox) {
                    expect(checkbox.isSelected()).to.eventually.be.true;
                });
            });

            it('should not disable the PublicNet checkbox for Non-Managed Accounts @nodev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('PublicNet').then(function (checkbox) {
                    expect(checkbox.isEnabled()).to.eventually.be.true;
                });
            });

            it('should not disable the ServiceNet checkbox for Non-Managed Accounts @nodev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('ServiceNet').then(function (checkbox) {
                    expect(checkbox.isEnabled()).to.eventually.be.true;
                });
            });

            it('should allow Non-Managed Accounts to de-select PublicNet @nodev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('PublicNet').then(function (checkbox) {
                    checkbox.click();
                    expect(checkbox.isSelected()).to.eventually.be.false;
                });
            });

            it('should allow Non-Managed Accounts to de-select ServiceNet @nodev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('ServiceNet').then(function (checkbox) {
                    checkbox.click();
                    expect(checkbox.isSelected()).to.eventually.be.false;
                });
            });
        });

        describe('RackConnect v2 User:', function () {

            var regionMessage = 'Selecting this region will automatically create a RackConnect v2 server.';
            var networkMessage = 'This server is a RackConnect v2 server. ServiceNet and PublicNet are mandatory ' +
                                 'and no custom networks are allowed.';

            var v2NetworkIds = ['00000000-0000-0000-0000-000000000000',
                                '11111111-1111-1111-1111-111111111111'];

            var standardNetworkIds = [ '00000000-0000-0000-0000-000000000000',
                                    '11111111-1111-1111-1111-111111111111',
                                    '4ea71cc2-7ad3-423c-98a4-dc5b077c0c70' ];

            before(function () {
                loginPage.switchToUser('rcstable02', '5911500');
                serversCreatePage.go();
            });

            after(function () {
                loginPage.switchToUser('hub_cap');
            });

            it('should indicate that this is a RackConnect v2 region @dev', function () {
                expect(serversCreatePage.rackConnectRegionMessageElement.isPresent()).to.eventually.be.true;
                serversCreatePage.rackConnectRegionMessage().then(function (msg) {
                    expect(msg).to.eq(regionMessage);
                });
            });

            it('should indicate that only RackConnect networks may be selected @dev', function () {
                expect(serversCreatePage.rackConnectNetworksMessageElement.isPresent()).to.eventually.be.true;
                serversCreatePage.rackConnectNetworksMessage().then(function (msg) {
                    expect(msg).to.eq(networkMessage);
                });
            });

            it('should show only the RackConnect v2 Networks for the user @dev', function () {
                serversCreatePage.networksTable.data().then(function (networks) {
                    var networkIds = _.pluck(networks, 'Network ID');
                    expect(networkIds).to.deep.equal(v2NetworkIds);
                });
            });

            it('should show all standard networks for the region if not RackConnect v2 @dev', function () {
                serversCreatePage.openNextGen('DFW (Dallas)');
                serversCreatePage.networksTable.data().then(function (networks) {
                    var networkIds = _.pluck(networks, 'Network ID');
                    expect(networkIds).to.deep.equal(standardNetworkIds);
                });
            });

            it('should not show the v2 message for non-RackConnect v2 regions @dev', function () {
                serversCreatePage.openNextGen('DFW (Dallas)');
                expect(serversCreatePage.rackConnectRegionMessageElement.isPresent()).to.eventually.be.false;
                expect(serversCreatePage.rackConnectNetworksMessageElement.isPresent()).to.eventually.be.false;
            });

            it('should check ServiceNet by default @dev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('ServiceNet').then(function (checkbox) {
                    expect(checkbox.isSelected()).to.eventually.be.true;
                });
            });

            it('should check PublicNet by default @dev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('PublicNet').then(function (checkbox) {
                    expect(checkbox.isSelected()).to.eventually.be.true;
                });
            });

            it('should require ServiceNet @dev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('ServiceNet').then(function (checkbox) {
                    expect(checkbox.isEnabled()).to.eventually.be.false;
                });
            });

            it('should require PublicNet @dev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('PublicNet').then(function (checkbox) {
                    expect(checkbox.isEnabled()).to.eventually.be.false;
                });
            });

        }); // describe('RackConnect v2 User')

        describe('RackConnect v3 User:', function () {

            var regionMessage = 'Selecting this region will automatically create a RackConnect v3 server.';
            var networkMessage = 'This server is a RackConnect v3 server. ' +
                'Only networks allowed for RackConnect v3 will be available.';

            var warningMessage = 'Exactly one isolated Rack Connect network must be selected.';

            var v3NetworkIds = ['07426958-1ebf-4c38-b032-d456820ca21a',
                                '11111111-1111-1111-1111-111111111111',
                                'ce7a58e9-6cc1-475b-a616-5aa654ee4712'
                               ];

            var standardNetworkIds = [ '00000000-0000-0000-0000-000000000000',
                                    '11111111-1111-1111-1111-111111111111',
                                    '4ea71cc2-7ad3-423c-98a4-dc5b077c0c70' ];

            before(function () {
                loginPage.switchToUser('rcstable01', '5911499');
                serversCreatePage.go();
            });

            after(function () {
                loginPage.switchToUser('hub_cap');
            });

            it('should indicate that this is a RackConnect v3 region @dev', function () {
                expect(serversCreatePage.rackConnectRegionMessageElement.isPresent()).to.eventually.be.true;
                serversCreatePage.rackConnectRegionMessage().then(function (msg) {
                    expect(msg).to.eq(regionMessage);
                });
            });

            it('should indicate that only RackConnect networks may be selected @dev', function () {
                expect(serversCreatePage.rackConnectNetworksMessageElement.isPresent()).to.eventually.be.true;
                serversCreatePage.rackConnectNetworksMessage().then(function (msg) {
                    expect(msg).to.eq(networkMessage);
                });
            });

            it('should show only the RackConnect v3 Networks for the user @dev', function () {
                serversCreatePage.networksTable.data().then(function (networks) {
                    var networkIds = _.pluck(networks, 'Network ID');
                    expect(networkIds).to.have.members(v3NetworkIds);
                });
            });

            it('should check ServiceNet by default for managed operation accounts @dev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('ServiceNet').then(function (checkbox) {
                    expect(checkbox.isSelected()).to.eventually.be.true;
                });
            });

            it('should require ServiceNet @dev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('ServiceNet').then(function (checkbox) {
                    expect(checkbox.isEnabled()).to.eventually.be.false;
                });
            });

            it('should select one Rack Connect Cloud Network by default @dev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('RC-CLOUD-1').then(function (checkbox) {
                    expect(checkbox.isSelected()).to.eventually.be.true;
                });
            });

            it('should not show warning message when one isolated network is selected @dev ', function () {
                expect(serversCreatePage.rackConnect3WarningMessageElement.isPresent()).to.eventually.be.false;
            });

            it('should show the v3 warning message when no Rack Connect Cloud Network is selected @dev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('RC-CLOUD-1').then(function (checkbox) {
                    checkbox.click();
                    expect(serversCreatePage.rackConnect3WarningMessageElement.isPresent()).to.eventually.be.true;
                });
                serversCreatePage.rackConnect3WarningMessage().then(function (msg) {
                    expect(msg).to.equal(warningMessage);
                });
            });

            it('should show the v3 warning message when more than one Rack  Network is selected @dev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('RC-CLOUD-1').then(function (checkbox) {
                    checkbox.click();
                });
                serversCreatePage.networksTable.checkboxForFilteredRow('RC-CLOUD-2').then(function (checkbox) {
                    checkbox.click();
                });
                expect(serversCreatePage.rackConnect3WarningMessageElement.isPresent()).to.eventually.be.true;
            });

            it('should show all standard networks for the region if not RackConnect v3 @dev', function () {
                serversCreatePage.openNextGen('DFW (Dallas)');
                serversCreatePage.networksTable.data().then(function (networks) {
                    var networkIds = _.pluck(networks, 'Network ID');
                    expect(networkIds).to.have.members(standardNetworkIds);
                });
            });

            it('should not show the v3 messages for non-RackConnect regions @dev', function () {
                serversCreatePage.openNextGen('DFW (Dallas)');
                expect(serversCreatePage.rackConnectRegionMessageElement.isPresent()).to.eventually.be.false;
                expect(serversCreatePage.rackConnectNetworksMessageElement.isPresent()).to.eventually.be.false;
            });

        }); // describe('RackConnect v3 User')

        describe('Managed User:', function () {

            before(function () {
                var region = 'DFW (Dallas)';
                loginPage.switchToUser('encoreqe2');
                serversCreatePage.openNextGen(region);
            });

            after(function () {
                loginPage.switchToUser('hub_cap');
            });

            it('should disable PublicNet checkboxes for Managed Accounts @nodev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('PublicNet').then(function (checkbox) {
                    expect(checkbox.isEnabled()).to.eventually.be.false;
                });
            });

            it('should disable ServiceNet checkboxes for Managed Accounts @nodev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('ServiceNet').then(function (checkbox) {
                    expect(checkbox.isEnabled()).to.eventually.be.false;
                });
            });

            it('should not allow Managed Accounts to de-select PublicNet @nodev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('PublicNet').then(function (checkbox) {
                    checkbox.click();
                    expect(checkbox.isSelected()).to.eventually.be.true;
                });
            });

            it('should not allow Managed Accounts to de-select ServiceNet @nodev', function () {
                serversCreatePage.networksTable.checkboxForFilteredRow('ServiceNet').then(function (checkbox) {
                    checkbox.click();
                    expect(checkbox.isSelected()).to.eventually.be.true;
                });
            });
        });

    });
});
