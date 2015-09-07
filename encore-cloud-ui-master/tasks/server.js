/* Usage: `$ grunt server` or `$ grunt server:dist` or `$ grunt server:stubbed:watch` */
module.exports = function (grunt) {
    grunt.registerTask('server',
        /* jshint maxlen: false */
        'Runs app in development mode. Options: "server", "server:dist", "server:stubbed:watch", "server:stubbed:watch:open"',
        function (target, watch, open) {
            var commonTasks = [
                'clean',
                'jshint',
                'jscs',
                'karma:watch',
                'less',
                'connect:livereload',
                'configureProxies:live'
            ];

            if (target === 'dist') {
                return grunt.task.run(['build', 'open', 'configureProxies:live', 'connect:dist:keepalive']);
            } else if (target === 'jenkins') {
                return grunt.task.run(['build', 'stubby', 'configureProxies:mocked', 'connect:dist:keepalive']);
            } else if (target === 'stubbed') {
                commonTasks.unshift('stubby');
                // Since we're going to use a different connect/configureProxies than the default
                // We need to get rid of the default tasks up above
                commonTasks.pop(); // gets rid of configureProxies:live
                commonTasks.pop(); // gets rid of connect:livereload
                // Add the connect:stubbed task, this gives us redirects for default URLs
                commonTasks.push('connect:stubbed');
                // Since we are stubbed we need mocked proxies
                commonTasks.push('configureProxies:mocked');
                if (watch === 'watch' || watch === 'true') {
                    commonTasks.push('watch');
                }
                if (open === 'open' || open === 'true') {
                    commonTasks.push('open');
                }
            } else {
                commonTasks.push('open');
                commonTasks.push('watch');
            }
            grunt.task.run(commonTasks);
        });
};
