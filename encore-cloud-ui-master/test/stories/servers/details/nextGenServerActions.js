/*jshint camelcase: false */
var tf = require('../../../pages/test-fixtures/api');
var nextGenDetails = require('../../../pages/servers/details').nextGen;
var serversOverviewPage = require('../../../pages/servers/overview');
var api = require('../../../api-helper/api');

describe('Cloud Servers NextGen Details Page - Server Detail Actions', function () {

    var accountNumber, user, changedServerName;
    before(function () {
        user = ptor.params.user;
        accountNumber = ptor.params.accountNumber;
    });

    describe('Midway tests', function () {
        var reachUrl = 'ui.staging.reach.rackspace.com';
        var cloudControlUrl = 'cloudcontrol.staging.us.ccp.rackspace.net';

        before(function () {
            nextGenDetails.go('2999ca73-f2d7-4275-ba45-84753332903b');
            basePage.disableRxNotifyTimeout();
        });

        // Was causing Jenkins to fail
        // afterEach(function () {
        //     basePage.dismissPageStatus();
        // });

        it('should allow you to open the server in Reach @dev', function () {
            nextGenDetails.lnkReach.click();
            expect(basePage.newWindowUrl).to.eventually.contain(reachUrl);
        });

        it('should allow you to open the server in Cloud Control @dev', function () {
            nextGenDetails.lnkCloudControl.click();
            expect(basePage.newWindowUrl).to.eventually.contain(cloudControlUrl);
        });

        it('should allow you to create an image @dev', function () {
            nextGenDetails.btnCreateImage.click();
            nextGenDetails.createImageModal.createImage('test');

            expect(encore.rxNotify.all.exists('Image created successfully.')).to.eventually.be.true;
        });

        it('should show a message if image failed to create @dev', function () {
            nextGenDetails.btnCreateImage.click();
            nextGenDetails.createImageModal.createImage('bad wolf');

            expect(encore.rxNotify.all.exists('Error creating image:')).to.eventually.be.true;
        });

        it('should allow you to attach a volume @dev', function () {
            var volumeName = 'new volume';
            var devicePath = '/dev/xvdb';

            nextGenDetails.btnAttachVolume.click();
            nextGenDetails.attachVolumeModal.attachVolume(volumeName, devicePath);

            expect(encore.rxNotify.all.exists('Volume Attached.')).to.eventually.be.true;
        });

        it('should show a message if volume failed to attach @dev', function () {
            var volumeName = 'new volume';
            var devicePath = '';
            var msg = 'Error attaching volume:';

            nextGenDetails.btnAttachVolume.click();
            nextGenDetails.attachVolumeModal.attachVolume(volumeName, devicePath);

            // because we only selected the first volume and didn't select a path,
            // the mock server won't recognize the API request and will return a 404
            expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
        });

        it('should allow you to change the servers name @dev', function () {
            var newServerName = 'TestUpdateServerName';

            nextGenDetails.btnChangeName.click();
            nextGenDetails.changeNameModal.changeName(newServerName);

            expect(encore.rxNotify.all.exists('Name changed.')).to.eventually.be.true;
        });

        it('should show a message if name failed to update @dev', function () {
            var awesomeError = 'Error changing name:';

            nextGenDetails.btnChangeName.click();
            nextGenDetails.changeNameModal.changeName('Nickleback');

            expect(encore.rxNotify.all.exists(awesomeError)).to.eventually.be.true;
        });

        describe('Change Password', function () {
            var cpModal = nextGenDetails.changePasswordModal;

            beforeEach(function () {
                nextGenDetails.go('2999ca73-f2d7-4275-ba45-84753332903b');
                basePage.disableRxNotifyTimeout();
                nextGenDetails.btnChangePassword.click();
            });

            it('should display success message if password updates @dev', function () {
                cpModal.changePassword('test123');
                expect(encore.rxNotify.all.exists('Password changed.')).to.eventually.be.true;
            });

            describe('before closing the modal', function () {
                afterEach(function () {
                    cpModal.close();
                });

                describe('when initially displayed', function () {
                    it('should not allow submission @dev', function () {
                        expect(cpModal.btnSubmit.isEnabled()).to.eventually.be.false;
                    });
                });//when initially displayed

                describe('upon entering a valid length password',  function () {
                    beforeEach(function () {
                        cpModal.txtPassword.sendKeys('valid-length-password');
                    });

                    it('should allow submission @dev', function () {
                        expect(cpModal.btnSubmit.isEnabled()).to.eventually.be.true;
                    });

                    it('should not display a field error message @dev', function () {
                        expect(cpModal.errPassword.isDisplayed()).to.eventually.be.false;
                    });
                });//valid length password

                describe('upon entering an invalid length password',  function () {
                    beforeEach(function () {
                        cpModal.txtPassword.sendKeys('test');
                    });

                    it('should not allow submission @dev', function () {
                        expect(cpModal.btnSubmit.isEnabled()).to.eventually.be.false;
                    });

                    it('should display a field error message @dev', function () {
                        expect(cpModal.errPassword.isDisplayed()).to.eventually.be.true;
                    });
                });//invalid length password
            });//before closing the modal
        });//Change Password

        it('should allow you to change the servers nickname @dev', function () {
            nextGenDetails.btnChangeNickname.click();
            nextGenDetails.changeNicknameModal.changeNickname('TestNickname');
            expect(encore.rxNotify.all.exists('Nickname changed.')).to.eventually.be.true;
        });

        it('should show a message if nickname failed to update @dev', function () {
            nextGenDetails.btnChangeNickname.click();
            nextGenDetails.changeNicknameModal.changeNickname('Failed Nickname');
            expect(encore.rxNotify.all.exists('Error changing nickname:')).to.eventually.be.true;
        });

        it('should allow you to soft reboot a server @dev', function () {
            nextGenDetails.btnRebootServer.click();
            nextGenDetails.rebootServerModal.rebootServer('soft');

            expect(encore.rxNotify.all.exists('Server rebooting.')).to.eventually.be.true;
        });

        it('should allow you to hard reboot a server @dev', function () {
            nextGenDetails.btnRebootServer.click();
            nextGenDetails.rebootServerModal.rebootServer('hard');

            expect(encore.rxNotify.all.exists('Server rebooting.')).to.eventually.be.true;
        });

        it('should show a message if error rebooting server @dev');

        it('should allow you to rescue a server @dev', function () {
            nextGenDetails.btnRescueServer.click();
            nextGenDetails.rescueServerModal.submit();

            expect(encore.rxNotify.all.exists('Server now in rescue mode.')).to.eventually.be.true;
        });

        it('should display a warning in modal before server rebuild @dev', function () {
            var msg = 'Warning: Rebuilding will destroy all data and install the image you selected.';

            nextGenDetails.btnRebuildServer.click();

            expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
            nextGenDetails.rescueServerModal.cancel();
        });

        it('should allow you to rebuild a server @dev', function () {
            var imageName = 'Red Hat Enterprise Linux 6.4';

            nextGenDetails.btnRebuildServer.click();
            nextGenDetails.rebuildServerModal.rebuildServer(imageName);

            expect(encore.rxNotify.all.exists('Server rebuilding.')).to.eventually.be.true;
        });

        it('should allow you to resize a server @dev', function () {
            var flavorName = '1GB Standard';

            nextGenDetails.btnResizeServer.click();
            nextGenDetails.resizeServerModal.resizeServer(flavorName);

            expect(encore.rxNotify.all.exists('Server resizing.')).to.eventually.be.true;
        });

        // TODO: Passes locally, fails on Jenkins PR builder
        it.skip('should open console in new window @dev', function () {
            nextGenDetails.btnOpenConsole.click();
            ptor.getAllWindowHandles().then(function (handles) {
                ptor.switchTo().window(handles[1]).then(function () {
                    var urlPattern = 'https://www.google.com/';
                    expect(browser.driver.getCurrentUrl()).to.eventually.equal(urlPattern);
                    browser.driver.close();
                });
                // Get back to original window
                ptor.switchTo().window(handles[0]).then(function () {});
            });
        });

        it('should display open console action @dev', function () {
            expect(nextGenDetails.btnOpenConsole).to.exist;
        });

        it('should allow you to delete a server @dev', function () {
            nextGenDetails.btnDeleteServer.click();
            nextGenDetails.deleteServerModal.submit();

            // should redirect to server overviews
            expect(nextGenDetails.currentUrl).to.eventually.equal(ptor.baseUrl + serversOverviewPage.url);
        });

    });

    describe('Deleting Actions', function () {

        before(function () {
            nextGenDetails.go('00000000-0783-4aac-9957-d0d2529a0bd8');
        });

        it('should disable "Create Image" on deleting server @dev', function () {
            nextGenDetails.btnCreateImage.click();
            expect(nextGenDetails.createImageModal.modalTitle.isPresent()).to.eventually.be.false;
        });

        it('should disable "Attach Volume" on deleting server @dev', function () {
            nextGenDetails.btnAttachVolume.click();
            expect(nextGenDetails.attachVolumeModal.modalTitle.isPresent()).to.eventually.be.false;
        });

        it('should disable "Change Password" on deleting server @dev', function () {
            nextGenDetails.btnChangePassword.click();
            expect(nextGenDetails.changePasswordModal.modalTitle.isPresent()).to.eventually.be.false;
        });

        it('should disable "Change Name" on deleting server @dev', function () {
            nextGenDetails.btnChangeName.click();
            expect(nextGenDetails.changeNameModal.modalTitle.isPresent()).to.eventually.be.false;
        });

        it('should disable "Reboot Server" on deleting server @dev', function () {
            nextGenDetails.btnRebootServer.click();
            expect(nextGenDetails.rebootServerModal.modalTitle.isPresent()).to.eventually.be.false;
        });

        it('should disable "Rebuild Server" on deleting server @dev', function () {
            nextGenDetails.btnRebuildServer.click();
            expect(nextGenDetails.rebuildServerModal.modalTitle.isPresent()).to.eventually.be.false;
        });

        it('should disable "Resize Server" on deleting server @dev', function () {
            nextGenDetails.btnResizeServer.click();
            expect(nextGenDetails.resizeServerModal.modalTitle.isPresent()).to.eventually.be.false;
        });

        it('should disable "Rescue Server" on deleting server @dev', function () {
            nextGenDetails.btnRescueServer.click();
            expect(nextGenDetails.rescueServerModal.modalTitle.isPresent()).to.eventually.be.false;
        });

        it('should disable "Delete Server" on deleting server @dev', function () {
            nextGenDetails.btnDeleteServer.click();
            expect(nextGenDetails.deleteServerModal.modalTitle.isPresent()).to.eventually.be.false;
        });
    });

    describe('Admin Authenticated Actions', function () {
        before(function () {
            loginPage.go();
            loginPage.loginLocalhost();
        });

        describe('Additional Public IPs', function () {
            before(function () {
                nextGenDetails.go('2999ca73-f2d7-4275-ba45-84753332903b');
                basePage.disableRxNotifyTimeout();
            });

            it('should allow you to add a public IP @dev', function () {
                var msg = 'The IP address has been added to the server. No manual provisioning' +
                    ' will be necessary since the IP address has been configured on the server.' +
                    ' Please allow a few minutes for this change to take effect.';
                nextGenDetails.btnAddPublicIp.click();
                nextGenDetails.addPublicIpModal.authSubmit();
                expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
            });

            it('should allow you to remove an IP @dev', function () {
                var msg = 'The IP address 10.23.192.133 has been removed from the server.' +
                    ' Please allow a few minutes for this change to take effect.';
                nextGenDetails.ipTable.tableIpsSecondRow.click();
                nextGenDetails.removeIpModal.authSubmit();

                expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
            });
        });

        describe('Migrate Server', function () {
            before(function () {
                nextGenDetails.go('2999ca73-f2d7-4275-ba45-84753332903b');
                basePage.disableRxNotifyTimeout();
            });

            it('should be able to migrate a server with correct password @dev', function () {
                var msg = 'Server is now migrating.';
                nextGenDetails.btnMigrateServer.click();
                nextGenDetails.migrateServerModal.authSubmit();

                expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
            });

            it('should display an error message on incorrect password @dev', function () {
                var errMsg = 'You may have entered an incorrect password or have insufficient access.';

                nextGenDetails.btnMigrateServer.click();
                nextGenDetails.migrateServerModal.authSubmit('bad_pass');

                expect(nextGenDetails.migrateServerModal.txtError).to.eventually.equal(errMsg);

            });
        });

        describe('Suspend Server', function () {
            before(function () {
                nextGenDetails.go('2999ca73-f2d7-4275-ba45-84753332903b');
                basePage.disableRxNotifyTimeout();
            });

            it('should be able to suspend a server with correct password @dev', function () {
                var msg = 'Server is now suspending.';

                nextGenDetails.btnSuspendServer.click();
                nextGenDetails.suspendServerModal.authSubmit();

                expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
            });

            it('should display an error message on incorrect password @dev', function () {
                var errMsg = 'You may have entered an incorrect password or have insufficient access.';

                nextGenDetails.btnSuspendServer.click();
                nextGenDetails.suspendServerModal.authSubmit('bad_pass');

                expect(nextGenDetails.suspendServerModal.txtError).to.eventually.equal(errMsg);

            });
        });

        describe('Unsuspend Server', function () {
            before(function () {
                nextGenDetails.go('ee56fac7-636d-43fb-8853-7e1a73112c10');
                basePage.disableRxNotifyTimeout();
            });

            it('should be able to unsuspend a server with correct password @dev', function () {
                var msg = 'Server is now unsuspending.';

                nextGenDetails.btnUnsuspendServer.click();
                nextGenDetails.unsuspendServerModal.authSubmit();

                expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
            });

            it('should display an error message on incorrect password @dev', function () {
                var errMsg = 'You may have entered an incorrect password or have insufficient access.';

                nextGenDetails.btnUnsuspendServer.click();
                nextGenDetails.unsuspendServerModal.authSubmit('bad_pass');

                expect(nextGenDetails.suspendServerModal.txtError).to.eventually.equal(errMsg);

            });
        });
    });

    describe('Regression Tests', function () {
        var removeIp = '';

        before(function () {
            var opts = {
                body: { flavor: '3' }
            };

            protractor.promise.all([
                api.servers.nextgen.addServerIp(tf.nextGenRemoveIpServer.name),
                api.servers.nextgen.suspendServer(tf.nextGenUnsuspendServer.name),
                api.servers.nextgen.rescueServer(tf.nextGenUnrescue.name),
                api.servers.nextgen.resizeServer(tf.nextGenRevertResize.name, opts)
            ]).then(function (promises) {
                removeIp = promises[0];
            });
        });

        after(function () {
            api.servers.nextgen.revertServerResize(tf.nextGenResize.name);
        });

        it('should create image of a NextGen server #regression', function () {
            var server = { name: tf.nextGenCreateImage.name };
            var filter = server.name;

            nextGenDetails.open(server, filter);
            nextGenDetails.createImage('test_image');

            expect(encore.rxNotify.all.exists('Image created successfully.')).to.eventually.be.true;
        });

        it('should attach volume to a NextGen server #regression', function () {
            var server = { name: tf.nextGenAttachVolServer.name };
            var volume = { name: tf.ssdAttachVolume.display_name };
            var filter = server.name;

            api.common.detachVolumeFromServer(volume.name, server.name);
            nextGenDetails.open(server, filter);
            nextGenDetails.attachVolume(volume.name);

            expect(encore.rxNotify.all.exists('Volume Attached.')).to.eventually.be.true;
        });

        it('should change password of a NextGen server #regression', function () {
            var server = { name: tf.nextGenChangePassword.name };
            var filter = server.name;

            nextGenDetails.open(server, filter);
            nextGenDetails.changePassword('LeNewPassWord');

            expect(encore.rxNotify.all.exists('Password changed.')).to.eventually.be.true;
        });

        it('should change name of a NextGen server #regression', function () {
            var server = { name: tf.nextGenChangeName.name };
            var filter = server.name;

            changedServerName = server.name + moment().valueOf();
            nextGenDetails.open(server, filter);
            nextGenDetails.changeName(changedServerName);

            expect(encore.rxNotify.all.exists('Name changed.')).to.eventually.be.true;
        });

        it('should soft reboot a nextGen server #regression', function () {
            var server = { name: tf.nextGenSoftReset.name };
            var filter = server.name;

            nextGenDetails.open(server, filter);
            nextGenDetails.rebootServer('soft');

            expect(encore.rxNotify.all.exists('Server rebooting.')).to.eventually.be.true;
        });

        it('should hard reboot a nextGen server #regression', function () {
            var server = { name: tf.nextGenHardReset.name };
            var filter = server.name;

            nextGenDetails.open(server, filter);
            nextGenDetails.rebootServer('hard');

            expect(encore.rxNotify.all.exists('Server rebooting.')).to.eventually.be.true;
        });

        it('should rebuild a NextGen server #regression', function () {
            var images = {
                staging: 'CentOS 6 (PV)',
                preprod: 'CentOS 6.5'
            };
            var imageName = images[ptor.params.env] || images['staging'];
            var server = { name: tf.nextGenRebuild.name };
            var filter = server.name;

            nextGenDetails.open(server, filter);
            nextGenDetails.btnRebuildServer.click();
            nextGenDetails.rebuildServerModal.rebuildServer(imageName);

            expect(encore.rxNotify.all.exists('Server rebuilding.')).to.eventually.be.true;
        });

        it('should resize a NextGen server #regression', function () {
            var server = { name: tf.nextGenResize.name };
            var filter = server.name;
            var flavorName = '1GB Standard';

            nextGenDetails.open(server, filter);
            nextGenDetails.btnResizeServer.click();
            nextGenDetails.resizeServerModal.resizeServer(flavorName);

            expect(encore.rxNotify.all.exists('Server resizing.')).to.eventually.be.true;
        });

        it('should rescue a NextGen server #regression', function () {
            var server = { name: tf.nextGenRescue.name };
            var filter = server.name;

            nextGenDetails.open(server, filter);
            nextGenDetails.rescueServer();

            expect(encore.rxNotify.all.exists('Server now in rescue mode.')).to.eventually.be.true;
        });

        it('should unrescue server server in rescue mode #regression', function () {
            var server = { name: tf.nextGenUnrescue.name };
            var filter = server.name;

            nextGenDetails.open(server, filter);
            nextGenDetails.btnUnrescueServer.click();
            nextGenDetails.rescueServerModal.submit();
            expect(encore.rxNotify.all.exists('Successfully unrescuing server.')).to.eventually.be.true;
        });

        it('should delete a NextGen server #regression', function () {
            var serversUrl = ptor.baseUrl + '/cloud/' +  accountNumber + '/' + user + '/servers';
            var serverName = 'name';
            var server = { name: tf.nextGenDelete.name };
            var filter = server.name;

            nextGenDetails.open(server, filter);
            nextGenDetails.deleteServer(serverName);

            expect(nextGenDetails.currentUrl).to.eventually.equal(serversUrl);
        });

        it('should link to the "ohthree" of a NextGen server #regression', function () {
            var server = { name: tf.nextGenChangePassword.name };
            var filter = server.name;

            nextGenDetails.open(server, filter);

            expect(nextGenDetails.ohThreePageTitle).to.eventually.equal('Rackspace');
        });

        it('should Link to a attached volume of a NextGen server #regression', function () {
            var server = { name: tf.nextGenAttachVolServer.name };
            var volume = { name: tf.ssdAttachVolume.display_name };
            var filter = server.name;

            api.common.attachVolumeToServer(volume.name, server.name).then(function () {
                nextGenDetails.open(server, filter);
                nextGenDetails.volumesTable.row(1).then(function (volume) {
                    nextGenDetails.volumesTable.openAttachedVolume(volume.ID);
                    var expectedUrl = ptor.baseUrl + '/cloud/' + accountNumber + '/' + user +
                                      '/cbs/volumes/ORD/' + volume.ID;
                    expect(nextGenDetails.currentUrl).to.eventually.eql(expectedUrl);
                });
            });
        });

        it('should "Resize Server" and "Revert Resize" #regression', function  () {
            var successMessage = 'Resize reverting';
            var server = { name: tf.nextGenRevertResize.name };
            var filter = server.name;

            nextGenDetails.open(server, filter);
            nextGenDetails.btnRevertResize.click();
            nextGenDetails.resizeServerModal.submit();

            expect(encore.rxNotify.all.exists(successMessage)).to.eventually.be.true;
        });

        it('should add a public IP #regression', function () {
            var server = { name: tf.nextGenAddIpServer.name };
            var filter = server.name;
            var msg = 'The IP address has been added to the server. No manual provisioning' +
                 ' will be necessary since the IP address has been configured on the server.' +
                 ' Please allow a few minutes for this change to take effect.';

            nextGenDetails.open(server, filter);
            nextGenDetails.btnAddPublicIp.click();
            nextGenDetails.addPublicIpModal.authSubmit();

            expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
        });

        it('should remove a public IP #regression', function () {
            var server = { name: tf.nextGenRemoveIpServer.name };
            var filter = server.name;
            var msg = 'The IP address ' + removeIp + ' has been removed from the server.' +
                ' Please allow a few minutes for this change to take effect.';

            nextGenDetails.open(server, filter);
            nextGenDetails.ipTable.tableIpRemove(removeIp).click();
            nextGenDetails.removeIpModal.authSubmit();

            expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
        });

        it('should migrate a server #regression', function () {
            var server = { name: tf.nextGenMigrateServer.name };
            var filter = server.name;

            nextGenDetails.open(server, filter);
            nextGenDetails.btnMigrateServer.click();
            nextGenDetails.migrateServerModal.authSubmit();

            expect(encore.rxNotify.all.exists('Server is now migrating.')).to.eventually.be.true;
        });

        it('should suspend a server #regression', function () {
            var server = { name: tf.nextGenSuspendServer.name };
            var filter = server.name;

            nextGenDetails.open(server, filter);
            nextGenDetails.btnSuspendServer.click();
            nextGenDetails.suspendServerModal.authSubmit();

            expect(encore.rxNotify.all.exists('Server is now suspending.')).to.eventually.be.true;
        });

        it('should unsuspend a server #regression', function () {
            var server = { name: tf.nextGenUnsuspendServer.name };
            var filter = server.name;

            nextGenDetails.open(server, filter);
            nextGenDetails.btnUnsuspendServer.click();
            nextGenDetails.unsuspendServerModal.authSubmit();

            expect(encore.rxNotify.all.exists('Server is now unsuspending.')).to.eventually.be.true;
        });
    });
});
