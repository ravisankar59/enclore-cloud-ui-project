var config = require('../util/config.js');

var stubbedRewrite = function (stubbed, middlewares) {
    // Only prepend the middlewares if we are stubbed
    if (stubbed === true) {
        middlewares.unshift(config.modRewrite(['^/' + config.appName + '/home$ ' + config.defaultPath + ' [R]']));
        middlewares.unshift(config.modRewrite(['^/' + config.appName + '/?$ ' + config.defaultPath + ' [R]']));
        middlewares.unshift(config.modRewrite(['^/search.* ' + config.defaultPath + ' [R]']));
        middlewares.unshift(config.modRewrite(['^/$ ' + config.defaultPath + ' [R]']));
    } else {
        middlewares.unshift(config.modRewrite(['^/$ /' + config.appName + '/home [R]']));
    }

    // Make sure we run this middleware first before all, to return an empty newrelic file
    middlewares.unshift(function (req, res, next) {
        if (req.url.indexOf('/newrelic') === 0) {
            res.setHeader('Content-Type', 'text/javascript');
            res.setHeader('Content-Length', 0);
            res.statusCode = 200;
            res.end('');
            return false;
        }
        return next();
    });
};

var devMiddleware = function (stubbed) {
    var middlewares = [
        config.proxyRequest,
        config.modRewrite(['!\\.[0-9a-zA-Z_-]+$ /app/index.html']),
        config.liveReloadPage,
    ];
    stubbedRewrite(stubbed, middlewares);
    return function (cnct) {
        middlewares.push(config.mountFolder(cnct, '.tmp'));
        middlewares.push(config.mountFolder(cnct, config.app + '/../'));
        return middlewares;
    };
};

var builtMiddleware = function (stubbed) {
    var middlewares = [
        config.proxyRequest,
        config.modRewrite(['/app /cloud']),
        config.modRewrite(['!\\.[0-9a-zA-Z_-]+$ /' + config.appName + '/index.html']),
    ];
    stubbedRewrite(stubbed, middlewares);
    return function (cnct) {
        middlewares.push(config.mountFolder(cnct, config.appDest + '/../'));
        return middlewares;
    };
};
module.exports = {
    options: {
        port: 9000,
        hostname: 'localhost'
    },

    live: {
        proxies: [].concat(config.defaultProxies),
    },

    mocked: {
        proxies: [].concat(config.mockedProxies).concat(config.defaultProxies),
    },

    livereload: {
        options: {
            middleware: devMiddleware()
        }
    },

    stubbed: {
        options: {
            middleware: devMiddleware(true),
            open: {
                appName: 'Google Chrome'
            }
        }
    },

    test: {
        options: {
            middleware: devMiddleware()
        }
    },

    dist: {
        options: {
            middleware: builtMiddleware()
        }
    },

    docs: {
        options: {
            middleware: function (cnct) {
                return [
                    config.mountFolder(cnct, config.ngdocs)
                ];
            }
        }
    }
};
