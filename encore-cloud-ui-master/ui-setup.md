# Encore UI Developer Setup

If this is your first time, you'll need to set up your coding environment to be able to build Encore UI and work with git.

## Preparing your environment

1. Install git

Many Mac OS X and Linux systems already have git installed. If your system doesn't, see [YUI's 'How to Set Up Your Git Environment'](http://yuilibrary.com/yui/docs/tutorials/git/) for instructions.

2. Install Node.js

[Download and install Node.js](http://howtonode.org/how-to-install-nodejs) if you don't already have it installed. All of Encore UI's build tools rely on Node.js.

3. Install NPM

NPM is used to manage Node.js dependencies. If you don't already have it installed, follow [the NPM installation instructions](http://howtonode.org/introduction-to-npm) to get a copy.

4. Install Bower

Bower is used to manage UI dependencies for use within the Encore application. Run `npm install -g bower` to install Bower.

5. Install Grunt

Grunt is used to automate the UI build and test tasks for Encore. Run `npm install -g grunt` to install Grunt.

##Installing inside of Rackspace

When installing on Rackspace's network run the following command to use git with the https protocol instead of the git protocol. This will resolve connection issues when running bower install.

```
git config --global url."https://".insteadOf git://
```

Also you may be prompted during the bower install for enter your Github username and password. If the console "Hangs" during install, first enter your Github username and then your password.

## Initial Encore Build

We follow a specific git workflow. If you are not fimiliar with this please read https://getwiki.rackspace.com/wiki/Git_Workflow

You will not want to clone the rackerlabs instance of encore-cloud-ui. Instead you will want to create a fork and then clone your own instance.

To do this, first, go to the https://github.com/rackerlabs/encore-cloud-ui and then click the fork button in the top right hand corner.  This will start the forking process. 

Since two-factor authentication is required for users, in order to successfully clone the repo you will need to create a personal access token on GitHub and use that access token as your password when prompted in the terminal. You will also need to set your credentials in the OSX Keychain

    git config --global credential.helper osxkeychain

Once complete you can 

```
git clone git@github.com:[your account]/encore-cloud-ui.git
```

After cloning, install the dependencies needed by Encore UI using NPM and bower:

`npm install`

`bower install`

## Running Encore UI

### 'Stubbed' Server

In order to speed development of the UI, a stubbed/mock version of the API server has been set up. This server accepts requests and responds with staging data.

`grunt server:stubbed:watch`

This will be run in place of the normal `grunt server` command.

To run against the staging server, use the following command:

`grunt server`

To log in to the website, you'll use your username and RSA to log in with REAL LIVE (staging) DATA (!!).

To access the server, load `http://localhost:9000/cloud/hub_cap/servers` in a browser tab.

### 'Stubbed' Server against staging/localhost

You can have the proxy forward all API requests to `localhost:3000` with some additional configuration. First, you'll need to have the [API project](https://github.com/rackerlabs/encore-cloud-api) running locally.

To run a server against `localhost:3000`, you'll need to open `tasks/util/config.js`. This is where all the proxy rules are. `/api/cloud` is where our API requests go. As you can see, it's forwarding them all to `staging.encore.rackspace.com`.

Comment out the following lines:

```
{
    context: '/api/cloud',
    host: 'staging.encore.rackspace.com',
    port: 443,
    https: true,
    changeOrigin: false
},
```

Then, add these lines to run against localhost:

```
{
    context: '/api/cloud',
    host: 'localhost',
    port: 3000,
    https: false,
    changeOrigin: false,
    rewrite: {
        '/api/cloud': '/api'
    }
},
```

Now when you run `grunt server`, you'll be running against local data. To log in to the website, use these details to load the mock account:
Username: racker
Password: pass

Note that a lot of pages aren't mocked out. It's usually a safe bet that the first link/option on a page is the one that's mocked out.
