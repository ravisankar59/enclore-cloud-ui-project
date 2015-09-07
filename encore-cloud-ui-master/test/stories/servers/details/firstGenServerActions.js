var tf = require('../../../pages/test-fixtures/api');
var firstGenDetails = require('../../../pages/servers/details').firstGen;
var serversOverviewPage = require('../../../pages/servers/overview');
var api = require('../../../api-helper/api');

describe('Cloud Servers FirstGen Details Page - Server Details Actions', function () {

    var user, changedServerName;
    before(function () {
        user = ptor.params.user;
    });

    describe('Midway Tests', function () {
        describe('Actions', function () {
            var reachUrl = 'ui.staging.reach.rackspace.com';
            var cloudControlUrl = 'cloudcontrol.staging.us.ccp.rackspace.net';

            before(function () {
                firstGenDetails.go('110148309');
                basePage.disableRxNotifyTimeout();
            });

            afterEach(function () {
                ptor.driver.navigate().refresh();
                basePage.disableRxNotifyTimeout();
            });

            it('should allow you to open the server in Reach @dev', function () {
                firstGenDetails.lnkReach.click();
                expect(basePage.newWindowUrl).to.eventually.contain(reachUrl);
            });

            it('should allow you to open the server in Cloud Control @dev', function () {
                firstGenDetails.lnkCloudControl.click();
                expect(basePage.newWindowUrl).to.eventually.contain(cloudControlUrl);
            });

            it('should allow you to create a next gen image @dev', function () {
                var successMessage = 'Creating Next Gen Image: 91453946-c520-4dc9-b64a-0bbf7f2e2616';

                firstGenDetails.btnCreateNextgenImage.click();
                firstGenDetails.createImageModal.createImage('TestFirstGenNextGenImageHOLLA');

                expect(encore.rxNotify.all.exists(successMessage)).to.eventually.be.true;
            });

            it('should show a message if image failed to create @dev', function () {
                var msg = 'Error creating image:';

                firstGenDetails.btnCreateNextgenImage.click();
                firstGenDetails.createImageModal.createImage('FailImage');

                expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
            });

            /* Cancel button tests are very flaky right now, and provide little value, so skipping them */
            it.skip('should focus cancel btn on reboot server modal @dev', function () {
                firstGenDetails.btnRebootServer.click();
                expect(browser.driver.switchTo().activeElement().getText()).to.eventually.equal('Cancel');
            });

            it('should allow you to soft reboot a server @dev', function () {
                firstGenDetails.btnRebootServer.click();
                firstGenDetails.rebootServerModal.rebootServer('soft');

                expect(encore.rxNotify.all.exists('Server rebooting.')).to.eventually.be.true;
            });

            it('should allow you to hard reboot a server @dev', function () {
                firstGenDetails.btnRebootServer.click();
                firstGenDetails.rebootServerModal.rebootServer('hard');

                expect(encore.rxNotify.all.exists('Server rebooting.')).to.eventually.be.true;
            });

            /* Cancel button tests are very flaky right now, and provide little value, so skipping them */
            it.skip('should focus cancel btn on rebuild server modal @dev', function () {
                firstGenDetails.btnRebuildServer.click();
                expect(browser.driver.switchTo().activeElement().getText()).to.eventually.equal('Cancel');
            });

            it('should allow you to rebuild a server @dev', function () {
                firstGenDetails.btnRebuildServer.click();
                firstGenDetails.rebuildServerModal.rebuildServer('Ubuntu 11.10 - MGC Base - XenServer');

                expect(encore.rxNotify.all.exists('Server rebuilding.')).to.eventually.be.true;
            });

            /* Cancel button tests are very flaky right now, and provide little value, so skipping them */
            it.skip('should focus cancel btn on resize server modal @dev', function () {
                firstGenDetails.btnResizeServer.click();
                expect(browser.driver.switchTo().activeElement().getText()).to.eventually.equal('Cancel');
            });

            it('should allow you to resize a server @dev', function () {
                firstGenDetails.btnResizeServer.click();
                firstGenDetails.resizeServerModal.resizeServer('1GB server');

                expect(encore.rxNotify.all.exists('Server resizing.')).to.eventually.be.true;
            });

            /* Cancel button tests are very flaky right now, and provide little value, so skipping them */
            it.skip('should focus cancel btn on rescue server modal @dev', function () {
                firstGenDetails.btnRescueServer.click();
                expect(browser.driver.switchTo().activeElement().getText()).to.eventually.equal('Cancel');
            });

            it('should allow you to rescue a server @dev', function () {
                var msg = 'Successfully placing server into rescue mode.';

                firstGenDetails.btnRescueServer.click();
                firstGenDetails.rescueServerModal.submit();

                expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
            });

            /* Cancel button tests are very flaky right now, and provide little value, so skipping them */
            it.skip('should focus cancel btn on change server password modal @dev', function () {
                firstGenDetails.btnChangePassword.click();
                expect(browser.driver.switchTo().activeElement().getText()).to.eventually.equal('Cancel');
            });

            it('should allow you to change the password @dev', function () {
                firstGenDetails.btnChangePassword.click();
                firstGenDetails.changePasswordModal.changePassword('somepass');

                expect(encore.rxNotify.all.exists('Password changed.')).to.eventually.be.true;
            });

            it('should show a message if password failed to update @dev', function () {
                var error = 'Error changing password:';

                firstGenDetails.btnChangePassword.click();
                firstGenDetails.changePasswordModal.changePassword('failpass');

                expect(encore.rxNotify.all.exists(error)).to.eventually.be.true;
            });

            /* Cancel button tests are very flaky right now, and provide little value, so skipping them */
            it.skip('should focus cancel btn on change server name modal @dev', function () {
                firstGenDetails.btnChangeName.click();
                expect(browser.driver.switchTo().activeElement().getText()).to.eventually.equal('Cancel');
            });

            it('should allow you to change the servers name @dev', function () {
                firstGenDetails.btnChangeName.click();
                firstGenDetails.changeNameModal.changeName('TestUpdateServerName');

                expect(encore.rxNotify.all.exists('Name changed.')).to.eventually.be.true;
            });

            it('should show a message if name failed to update @dev', function () {
                var awesomeError = 'Error changing name:';

                firstGenDetails.btnChangeName.click();
                firstGenDetails.changeNameModal.changeName('Nickleback');

                expect(encore.rxNotify.all.exists(awesomeError)).to.eventually.be.true;
            });

            it('should allow you to unrescue a server @dev', function () {
                firstGenDetails.btnRescueServer.click();
                firstGenDetails.rescueServerModal.submit();
                basePage.dismissPageStatus();

                firstGenDetails.btnUnrescueServer.click();
                firstGenDetails.rescueServerModal.submit();

                expect(encore.rxNotify.all.exists('Successfully unrescuing server.')).to.eventually.be.true;
            });

            it.skip('should open console in new window @dev', function () {
            // TODO: Work with popup blockers in jenkins
                firstGenDetails.serverConsole.click();
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

            /* Cancel button tests are very flaky right now, and provide little value, so skipping them */
            it.skip('should focus cancel btn on delete server modal @dev', function () {
                firstGenDetails.btnDeleteServer.click();
                expect(browser.driver.switchTo().activeElement().getText()).to.eventually.equal('Cancel');
            });

            it('should allow you to delete a server @dev', function () {
                firstGenDetails.btnDeleteServer.click();
                firstGenDetails.deleteServerModal.submit();

                expect(firstGenDetails.currentUrl).to.eventually.equal(ptor.baseUrl + serversOverviewPage.url);
            });

            it('should show error message if no server found @dev', function () {
                var badServerUrl = ptor.baseUrl + '/cloud/323676/hub_cap/servers/firstgen/110148310';
                var error = 'Error loading server details:';

                ptor.get(badServerUrl);

                expect(encore.rxNotify.all.exists(error)).to.eventually.be.true;
            });

            describe('Change Password', function () {
                var cpModal = firstGenDetails.changePasswordModal;

                beforeEach(function () {
                    firstGenDetails.go('110148309');
                    basePage.disableRxNotifyTimeout();
                    firstGenDetails.btnChangePassword.click();
                });

                it('should display error message if password failed to update @dev', function () {
                    cpModal.changePassword('failpass');

                    var error = 'Error changing password:';
                    expect(encore.rxNotify.all.exists(error)).to.eventually.be.true;
                });

                //FIXME: Flaky Failure
                it.skip('should display success message if password updates @dev', function () {
                    cpModal.changePassword('somepass');

                    expect(encore.rxNotify.all.exists('Password changed.')).to.eventually.be.true;
                });

                describe('before closing the modal', function () {
                    afterEach(function () {
                        cpModal.cancel();
                    });

                    describe('when initially displayed', function () {
                        it('should not allow submission @dev', function () {
                            expect(cpModal.btnSubmit.isEnabled()).to.eventually.be.false;
                        });
                    }); //when initially displayed

                    describe('upon entering a valid length password', function () {
                        beforeEach(function () {
                            cpModal.txtPassword.sendKeys('valid-length-password');
                        });

                        it('should allow submission @dev', function () {
                            expect(cpModal.btnSubmit.isEnabled()).to.eventually.be.true;
                        });

                        it('should not display a field error message @dev', function () {
                            expect(cpModal.errPassword.isDisplayed()).to.eventually.be.false;
                        });
                    }); //valid length password

                    describe('upon entering an invalid length password', function () {
                        beforeEach(function () {
                            cpModal.txtPassword.sendKeys('test');
                        });

                        it('should not allow submission @dev', function () {
                            expect(cpModal.btnSubmit.isEnabled()).to.eventually.be.false;
                        });

                        it('should display a field error message @dev', function () {
                            expect(cpModal.errPassword.isDisplayed()).to.eventually.be.true;
                        });
                    }); //invalid length password
                }); //before closing the modal
            });//Change Password

            describe('Deleting Midways', function () {

                before(function () {
                    firstGenDetails.go('100000000');
                });

                afterEach(function () {
                    basePage.dismissPageStatus();
                });

                it('should disable "Create Image" on deleting server @dev', function () {
                    firstGenDetails.btnCreateNextgenImage.click();
                    expect(firstGenDetails.createImageModal.modalTitle.isPresent()).to.eventually.be.false;
                });

                it('should disable "Change Password" on deleting server @dev', function () {
                    firstGenDetails.btnChangePassword.click();
                    expect(firstGenDetails.changePasswordModal.modalTitle.isPresent()).to.eventually.be.false;
                });

                it('should disable "Change Name" on deleting server @dev', function () {
                    firstGenDetails.btnChangeName.click();
                    expect(firstGenDetails.changeNameModal.modalTitle.isPresent()).to.eventually.be.false;
                });

                it('should disable "Reboot Server" on deleting server @dev', function () {
                    firstGenDetails.btnRebootServer.click();
                    expect(firstGenDetails.rebootServerModal.modalTitle.isPresent()).to.eventually.be.false;
                });

                it('should disable "Rebuild Server" on deleting server @dev', function () {
                    firstGenDetails.btnRebuildServer.click();
                    expect(firstGenDetails.rebuildServerModal.modalTitle.isPresent()).to.eventually.be.false;
                });

                it('should disable "Resize Server" on deleting server @dev', function () {
                    firstGenDetails.btnResizeServer.click();
                    expect(firstGenDetails.resizeServerModal.modalTitle.isPresent()).to.eventually.be.false;
                });

                it('should disable "Rescue Server" on deleting server @dev', function () {
                    firstGenDetails.btnRescueServer.click();
                    expect(firstGenDetails.rescueServerModal.modalTitle.isPresent()).to.eventually.be.false;
                });

                it('should disable "Delete Server" on deleting server @dev', function () {
                    firstGenDetails.btnDeleteServer.click();
                    expect(firstGenDetails.deleteServerModal.modalTitle.isPresent()).to.eventually.be.false;
                });
            });

        });
    });

    describe('Regression Tests', function () {

        before(function () {
            protractor.promise.all([
                api.servers.firstgen.rescueServer(tf.firstGenUnrescue.name),
                api.servers.firstgen.resizeServer(tf.firstGenRevertResize.name)
            ]);
        });

        it('should create a NextGen image of a FirstGen server #regression', function () {
            var imageName = 'image ' + moment().valueOf();
            var query = { name: tf.firstGenCreateImage.name };
            var filter = query.name;

            firstGenDetails.open(query, filter);
            firstGenDetails.createNextgenImage(imageName);

            expect(encore.rxNotify.all.exists('Creating Next Gen Image:')).to.eventually.be.true;
        });

        it('should change password of a FirstGen server #regression', function () {
            var query = { name: tf.firstGenChangePassword.name };
            var filter = query.name;

            firstGenDetails.open(query, filter);
            firstGenDetails.changePassword('LePazz2005');

            expect(encore.rxNotify.all.exists('Password changed.')).to.eventually.be.true;
        });

        it('should change name of a FirstGen server #regression', function () {
            var query = { name: tf.firstGenChangeName.name };
            var filter = query.name;
            changedServerName = query.name + moment().valueOf();

            firstGenDetails.open(query, filter);
            firstGenDetails.changeName(changedServerName);

            expect(encore.rxNotify.all.exists('Name changed.')).to.eventually.be.true;
        });

        it('should soft reboot a FirstGen server #regression', function () {
            var rebootType = 'soft';
            var query = { name: tf.firstGenSoftReset.name };
            var filter = query.name;

            firstGenDetails.open(query, filter);
            firstGenDetails.rebootServer(rebootType);

            expect(encore.rxNotify.all.exists('Server rebooting.')).to.eventually.be.true;
        });

        it('should hard reboot a FirstGen server #regression', function () {
            var rebootType = 'hard';
            var query = { name: tf.firstGenHardReset.name };
            var filter = query.name;

            firstGenDetails.open(query, filter);
            firstGenDetails.rebootServer(rebootType);

            expect(encore.rxNotify.all.exists('Server rebooting.')).to.eventually.be.true;
        });

        it('should rebuild a FirstGen server #regression', function () {
            var image = {
                production: 'CentOS 5',
                preprod: 'CentOS 5',
                staging: 'CentOS 5 - MGC Base'
            };
            var query = { name: tf.firstGenRebuild.name };
            var filter = query.name;

            firstGenDetails.open(query, filter);
            firstGenDetails.btnRebuildServer.click();
            firstGenDetails.rebuildServerModal.rebuildServer(image[ptor.params.env]);

            expect(encore.rxNotify.all.exists('Server rebuilding.')).to.eventually.be.true;
        });

        it('should resize a FirstGen server #regression', function () {
            var query = { name: tf.firstGenResize.name };
            var filter = query.name;

            firstGenDetails.open(query, filter);
            firstGenDetails.resizeServer();

            expect(encore.rxNotify.all.exists('Server resizing.')).to.eventually.be.true;
        });

        it('should rescue a FirstGen server #regression', function () {
            var successMessage = 'Successfully placing server into rescue mode.';
            var query = { name: tf.firstGenRescue.name };
            var filter = query.name;

            firstGenDetails.open(query, filter);
            firstGenDetails.rescueServer();

            expect(encore.rxNotify.all.exists(successMessage)).to.eventually.be.true;
        });

        it('should unrescue a FirstGen server #regression', function () {
            var successMessage = 'Successfully unrescuing server.';
            var query = { name: tf.firstGenUnrescue.name };
            var filter = query.name;

            firstGenDetails.open(query, filter);
            firstGenDetails.unrescueServer();

            expect(encore.rxNotify.all.exists(successMessage)).to.eventually.be.true;
        });

        it('should open the console of a FirstGen server #regression', function () {
            var query = { name: tf.firstGenChangePassword.name };
            var filter = query.name;

            firstGenDetails.open(query, filter);

            expect(firstGenDetails.consolePageTitle).to.eventually.equal('VNC Session');
        });

        it('should delete a FirstGen server #regression', function () {
            var query = { name: tf.firstGenDelete.name };
            var filter = query.name;

            firstGenDetails.open(query, filter);
            firstGenDetails.deleteServer();

            // TODO EN-934 redirects to overview page, look through name column for server
        });

        it('should "Resize Server" and then revert the resize #regression', function () {
            var successMessage = 'Resize reverting';
            var query = { name: tf.firstGenRevertResize.name };
            var filter = query.name;
            firstGenDetails.open(query, filter);
            firstGenDetails.btnRevertResize.click();
            firstGenDetails.resizeServerModal.submit();

            expect(encore.rxNotify.all.exists(successMessage)).to.eventually.be.true;
        });

    });

    describe('Pending Tests', function () {

        it('should run a "Health Check" #regression');

        it('should View Admin Access Password for Managed account #regression');

    });
});
