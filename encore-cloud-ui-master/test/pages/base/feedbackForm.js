module.exports = {

    btnFeedbackForm: {
        get: function () { return $('rx-feedback rx-modal-action span a'); }
    },

    btnSubmitFeedback: {
        get: function () { return $('button.feedback-submission'); }
    },

    frmFeedback: {
        // Exists simply to determine if the form is displayed or not.
        get: function () { return $('form[name="feedback-form"]'); }
    },

    lblFeedbackSubmissionAlert: {
        get: function () { return $('rx-alert > div'); }
    },

    lnkFeedbackClose: {
        get: function () { return $('a.feedback-close'); }
    },

    txtFeedbackArea: {
        get: function () { return $('textarea.feedback-comment'); }
    },

    isDisplayed: {
        value: function () {
            return this.frmFeedback.getAttribute('class').then(function (classText) {
                return classText.indexOf('ng-hide') > -1;
            });
        }
    },

    show: {
        value: function () {
            if (!this.isDisplayed()) {
                this.btnFeedbackForm.click();
            }
        }
    },

    hide: {
        // Clicking the button again when
        // the form is visible will hide it.
        value: function () {
            if (this.isDisplayed()) {
                this.btnFeedbackForm.click();
            }
        }
    },

    close: {
        value: function () {
            if (this.isDisplayed()) {
                this.lnkFeedbackClose.click();
            }
        }
    },

    submit: {
        // Will wait until the feedback submission alert displays.
        // Will throw an exception if the confirmation doesn't appear,
        // or does appear and is anything but a success.
        value: function (feedbackText) {
            var page = this;
            this.show();
            this.txtFeedbackArea.sendKeys(feedbackText);
            this.btnSubmitFeedback.click();
            this.driver.wait(function () {
                return page.lblFeedbackSubmissionAlert.getAttribute('class').then(function (className) {
                    return className.indexOf('ng-hide') === -1;
                });
            }, 15000);
            return this.lblFeedbackSubmissionAlert.getAttribute('class').then(function (className) {
                if (className.indexOf('ng-hide') > -1) {
                    // The submission confirmation never appeared
                    page.FeedbackSubmissionError.thro('confirmation was never shown to the user');
                }
                if (className.indexOf('success') === -1) {
                    // The submission was a failure.
                    return page.lblFeedbackSubmissionAlert.getText().then(function (text) {
                        page.FeedbackSubmissionError.thro('error message reported as ' + text);
                    });
                }
            });
        }
    },

    FeedbackSubmissionError: {
        get: function () { return this.exception('Submission failed'); }
    }

};
