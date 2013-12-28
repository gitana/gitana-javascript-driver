module.exports = function(grunt) {

    var WEB_SERVER_HOST = "localhost";
    var WEB_SERVER_PORT = 8000;
    var WEB_SERVER_BASE_PATH = "/apps/gitana";

    var PROXY_HOST = "localhost";
    var PROXY_PORT = 8080;
    var PROXY_TIMEOUT = 5 * 60 * 1000;

    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-bumpup');

    // register one or more task lists (you should ALWAYS have a "default" task list)
    grunt.registerTask('test', ['configureProxies:testing', 'connect:testing', 'qunit']);
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

        /*
        // push ahead some middleware that modifies "set-cookie" to the originating host
        middlewares.unshift(function(req, res, next) {

            var updateSetCookieHost = function(value)
            {
                var newHost = req.host;
                if (newHost)
                {
                    var i = value.indexOf("Domain=");
                    if (i > -1)
                    {
                        var j = value.indexOf(";", i);
                        if (j > -1)
                        {
                            value = value.substring(0, i+7) + newHost + value.substring(j);
                        }
                        else
                        {
                            value = value.substring(0, i+7) + newHost;
                        }
                    }
                }

                return value;
            };

            var _setHeader = res.setHeader;
            res.setHeader = function(key, value)
            {
                if (key.toLowerCase() == "set-cookie")
                {
                    for (var x in value)
                    {
                        value[x] = updateSetCookieHost(value[x]);
                    }
                }

                _setHeader.call(this, key, value);
            };

            next();

        });
        */

        return middlewares;
    };

    grunt.event.on('qunit.begin', function (url) {
        grunt.log.ok("");
    });

    // config
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        qunit: {
            all: {
                options: {
                    timeout: 60000, // let them timeouts run long (1 minute)
                    urls: [
                        "http://" + WEB_SERVER_HOST + ":" + WEB_SERVER_PORT + "/tests/index.html"
                    ],
                    force: true,
                    '--cookies-file': 'build/cookies.txt'
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
        },

        jshint: {
            gitana: {
                options: {
                    'multistr': true,
                    'scripturl': true,
                    'laxcomma': true,
                    '-W069': true, // "['variable'] is better written in dot notation
                    '-W041': true, // "Use '===' to compare with null or 0
                    '-W004': true, // duplicate variables
                    '-W014': true, // line breaking +
                    '-W065': true, // radix
                    '-W083': true  // functions in loops
                },
                src: ['js/gitana/**/*.js']
            }
        },

        bumpup: 'package.json'
    });
};