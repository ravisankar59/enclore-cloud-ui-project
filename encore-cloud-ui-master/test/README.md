#Testing

##Definition of test categories

####Smoke
These are typically quick running tests.  Primarily these tests are concerned with element placement, appearance, and behavior.  Tests like:
* Is this thing present?
* Does this button open the correct modal?
* Does sorting work on this table?
* Is this button disabled/enabled at the right times?

####Regression
These tests typically take a bit longer than smoke tests.  In general these tests should exercise functionality that hits external endpoints.  Tests like:
* Can we create a first gen 2GB instance?
* Can we delete a load balancer?
* Can we add a user to a database

####Midway
Midway tests can encompass some aspects of both smoke and regression testing.  In midway, we test against mocked endpoints instead of staging or production data.  This is how we test locally, and how we validate our pull requests.  We also tackle functionality that's impractical to test in production, for example, responses to long-running operations or tests that require large amounts of test data.  Tests like:
* Smoke or regression tests as above
* Does a success message display after enabling logging on a load balancer?
* Does a table paginate correctly when there are 500 items in it?

##Running the tests

protractor &lt;path/to/conf&gt;

##Running a specific test

protractor &lt;path/to/conf&gt; --specs &lt;path/to/spec&gt;

####example:
protractor test/conf/smoke/protractor.staging.conf.js --specs 'test/stories/\*\*/\*.js'

##Directory Structure

```
test
    ├─ api-mocks // Mock requests and responses for stubby
    ├─ conf      // Protractor config files
    ├─ pages     // Astrolabe page objects
    ├─ perf      // UI performance testing
    ├─ stories   // UI tests
```

##Test tags

| Tags        | Description                       |
|-------------|:---------------------------------:|
| @dev        | Test only in midway               |
| @nodev	  | Do not test in midway
| @noprod     | Do not test in Prod               |
| #regression | Test only during regression tests |
| no tag      | Test in any environment           |

##Config Files

| Name        | Description                             |
|-------------|:---------------------------------------:|
| e2e         | Runs all tests expect tests tagged @dev |
| smoke       | Runs all untagged tests                 |
| midway      | Runs untagged and @dev tests            |
| regression  | Runs all tests tagged with #regression  |
