# Testing

Goal: Ability to deliver features *quickly* to production with high *reliability* and *quality*

In order to support continuous development/integration, taking advantage of automated testing is a must. While the goal of automated testing is to provide full coverage, it also needs to be seemlessly integrated into the developer environment. Hopefully this README explains how this (hopefully) has been done.

## Test Levels

### Component Testing
 - Code level tests
 - Stored in same location as code (separate file with *.spec.js)
 - Best for testing services, classes and objects
 - Does contain "functional" tests (it tests browser interactions like 'click')
 - Sandboxed & Isolated testing
 - Mocking & Stubbing required
 - Fast
 - Uses Karma + Mocha + Chai + Sinon
 - Think of as testing the building blocks of the application, but not the application itself

### Midway Testing
 - Page level tests
 - Can access all parts of an application
 - Uses [stub.by](https://github.com/mrak/stubby4node) for mocking the API server responses
 - Uses selenium, protractor, astrolabe
 - Somewhat slow
 - Story Based

### E2E Testing
 - Application level tests
 - Uses live data (uses actual API server)
 - Requires its own special web server (basically requires an entire server environment to be set up)
 - Unable to access Application JavaScript code (only rendered HTML and some AngularJS info)
 - Uses selenium, protractor, astrolabe
 - Slow
 - Story Based
 - Systems Based

## Test Variants

### Smoke Tests

Goal: Validate mission critical functionality before running entire test suite

### Regression Tests

Goal: Test that all existing components work as expected


## Configuration Files

More details on these files are found in the files themselves

**karma.conf.js** - Used by our component tests

**protractor.*.conf.js** - Used by our UI tests

**secrets.js** - Default credentials

## Running Tests

NOTE: The following line is currently a lie

Testing is setup to run through the `grunt test` command. Running this should execute the entire suite of tests (component/midway/e2e).

### Component Tests (aka unit tests)

Goal: Tests smallest piece of functionality or method

Use `grunt test:unit` to run these tests apart from running midway/e2e tests

When you're making a lot of unit test related changes, it's faster to leave PhantomJS running (rather than spinning up a new instance every time). Use the following command to have grunt 'watch' your files:

`grunt test:dev`

To run your tests in debug mode, do `grunt test:debug`. This will launch a Chrome browser and start all your tests. When the tests have completed, the browser will stay open and you can simply reload the page to run the tests again.

Running in this mode allows you to put `debugger;` anywhere in either your tests or your source code. When a debugger statement is encountered while in `test:debug` mode and you've opened the Chrome Developer Tools (command-option-I on a Mac), execution will be paused at the debugger and you can step through the code in Chrome. This will let you do any variable evaluation, function call, etc. that you want.

This mode will also automatically watch for changes in your test files, and rerun the tests on change. Please note that if execution is currently paused because of a debugger statement, the tests won't rerun. You can either continue execution or simply reload the page to run the tests again.

### Testing Individual Components

When developing a specific component, you likely don't want to run the entire test suite on every change. In order to test a single set of functionality, use the 'only' function when describing your test. For example:

`describe.only('Login', function () { ... tests go here ... })`

**Be sure to remove the `only` once you're done.**

#### Full Browser Regression

By default, unit tests are only executed against PhantomJS. In order to test across Firefox, Chrome, Chrome Canary and Safari, run `grunt karma:full` (note 'karma', not 'test'). **Make sure you have all 4 browsers installed first**.

#### Code Coverage

Code coverage stats for our component tests are generated every time the test suite is executed. To view the stats, simply open the index.html file in any of the browser directories in the 'coverage' directory.


### Page Object Model

For both Midway and E2E tests, we use a Page Object library called [Astrolabe](https://github.com/stuplum/astrolabe).


### Midway Tests

Goal: Validate our appplication in isolation from its dependencies (e.g. API Server)

Install [Protractor](https://github.com/angular/protractor/). We use a specific version of Protractor, which requires Firefox v34 (with auto-updating disabled). Install Protractor 1.8.0 by running:

    npm install -g protractor@1.8.0

In order to run the midway test suite, you will need a Selenium server running.
Selenium is included as part of the installer for Protractor.

First run the update command, which will install the latest version of Selenium and required drivers:

    webdriver-manager update

When you are ready to run your tests, start an instance of the Selenium server with the server start command.  You may want to run this command in a separate terminal window:

    webdriver-manager start

Server mocks are done using Stub.by. Server stubs are stored in the frontend/test/api-mocks folder. You need to ensure that you already have a development server running with Stub.by. If you haven't already, start up your stubbed server:

    grunt server:stubbed:watch

Before running the midway tests, make sure you are signed onto the VPN. The Login page used is served up by our staging servers, so the VPN has to be running to access them.

If you do not already have [Mocha](http://mochajs.org/) installed, you will need to install it in order to run the tests.

    npm install -g mocha

You will also need a `test/secrets.js` file. You can copy `test/secrets.js.default`, unmodified, and it will work fine.

Finally, open a new terminal and run this command:

    protractor test/conf/protractor.midway.conf.js

You can also create a `test/protractor.conf.local.js` file to use when you need dev-specific settings that you don't want used in the CICD builds.

#### Testing Individual Pages

When developing a specific page, it's much quicker to run tests only for that page (rather than run the entire suite every time). In order to limit the tests to just that page, pass in path to the file to test as the third option in your grunt command. For example:

`protractor test/conf/protractor.midway.conf.js --specs=test/stories/servers/details/nextGenPageLayout.js`

`--specs` can also accept a comma-separate list of files (make sure there are *NO* spaces between the paths), i.e.

`protractor test/protractor.conf.js --specs='test/stories/servers/details/nextGenPageLayout.js,test/stories/servers/details/nextGenServerActions.js'`


### E2E Tests

Goal: Validate our app & all dependencies work in correlation as expected

#### Setting up E2E tests on Jenkins

First, set your github pull settings, build triggers, and the post-build notifications for the build status, hipchat, etc.

Here is a list of what you might want to set up:

 1. Hipchat Notifications
 - Parameterized Build (String parameter = "sha1")
 - Source Code Management
 - Build Triggers (GitHub pull requests builder)
 - Build Environment (Color ANSI Console Output, ANSI color map = xterm)
 - Execute Shell (see below for information about `jenkins.example.sh`)
 - Post build actions (Publish HTML reports, HipChat notifications, build status on Github, Delete Workspace)


You can use the [starter jenkins CICD script](./test/jenkins.example.sh) for the *"Execute shell"* step.

Be sure to set the workspace [to be deleted after each build ends](https://wiki.jenkins-ci.org/display/JENKINS/Workspace+Cleanup+Plugin), regardless of whether or not it was a success or failure.

You'll need to *exclude* the following directories and files from this cleanup process:

 - report/\**
 - coverage/\**

Check the box that says *"Apply pattern also on directories"*.

Next, you'll need to SSH into the server and edit the jenkins user's `~/secrets.js` file if necessary.

For an example of what the bare minimum is for a secrets file, see [`test/secrets.example.js`](./test/secrets.example.js).
