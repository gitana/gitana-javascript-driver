module.exports = function(grunt) {

    var WEB_SERVER_BASE_PATH = "/apps/gitana";
    var WEB_SERVER_PORT = 8000;
    var WEB_SERVER_HOST = "localhost";
    var PROXY_HOST = "localhost";
    var PROXY_PORT = 8080;
    var PROXY_TIMEOUT = 5 * 60 * 1000;

    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-contrib');

    // register one or more task lists (you should ALWAYS have a "default" task list)
    grunt.registerTask('default', ['runtests']);
    grunt.registerTask('runtests', ['configureProxies:testing', 'connect:testing', 'qunit']);
    grunt.registerTask('web', ['configureProxies:standalone', 'connect:standalone']);

    // injects a proxy into the middleware stack
    var middleware = function(connect, options)
    {
        // default
        var middlewares = [];
        var directory = options.directory || options.base[options.base.length - 1];
        if (!Array.isArray(options.base)) {
            options.base = [options.base];
        }
        options.base.forEach(function(base) {
            // Serve static files.
            middlewares.push(connect.static(base));
        });
        // Make directory browse-able.
        middlewares.push(connect.directory(directory));

        // push our proxy logic ahead on the middlewares
        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
        middlewares.unshift(proxy);

        return middlewares;
    };

    // config
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        qunit: {
            all: {
                options: {
                    timeout: 120000, // let them timeouts run long (2 minutes)
                    urls: [
                        "http://" + WEB_SERVER_HOST + ":" + WEB_SERVER_PORT + "/tests/index.html"
                    ],
                    "--version": true,
                    "--debug": true
                }
            }
        },

        connect: {
            standalone: {
                options: {
                    base: WEB_SERVER_BASE_PATH,
                    hostname: WEB_SERVER_HOST,
                    port: WEB_SERVER_PORT,
                    keepalive: true,
                    middleware: middleware
                },
                proxies: [{
                    context: "/proxy",
                    host: PROXY_HOST,
                    port: PROXY_PORT,
                    timeout: PROXY_TIMEOUT,
                    https: false,
                    changeOrigin: true,
                    xforward: true,
                    rewrite: {
                        '^/proxy': ''
                    }
                }]
            },
            testing: {
                options: {
                    base: WEB_SERVER_BASE_PATH,
                    hostname: WEB_SERVER_HOST,
                    port: WEB_SERVER_PORT,
                    middleware: middleware
                },
                proxies: [{
                    context: "/proxy",
                    host: PROXY_HOST,
                    port: PROXY_PORT,
                    timeout: PROXY_TIMEOUT,
                    https: false,
                    changeOrigin: true,
                    xforward: true,
                    rewrite: {
                        '^/proxy': ''
                    }
                }]
            }
        }
    });
};