module.exports = function(grunt) {

    var path = require("path");

    var WEB_SERVER_HOST = "test.cloudcms.com";
    var WEB_SERVER_PORT = 8000;
    var WEB_SERVER_BASE_PATH = ".";

    var PROXY_HOST = "test.cloudcms.com";
    var PROXY_PORT = 8080;
    var PROXY_TIMEOUT = 5 * 60 * 1000;

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-invalidate-cloudfront');
    grunt.loadNpmTasks('grunt-bumpup');

    // register one or more task lists (you should ALWAYS have a "default" task list)
    grunt.registerTask('web', ['configureProxies:standalone', 'connect:standalone']);
    grunt.registerTask('cdn', ['aws_s3:clean_version', 'aws_s3:clean_latest', 'aws_s3:publish_version', 'aws_s3:publish_latest', 'invalidate_cloudfront:production_version', 'invalidate_cloudfront:production_latest']);
    grunt.registerTask('bump', ['bumpup']);

    var pkg = grunt.file.readJSON('package.json');

    // aws configuration
    var awsConfig = {
        cloudfrontDistributionIds: []
    };
    try {
        awsConfig = grunt.file.readJSON("../settings/__aws.json");
    } catch (e) {
    }

    var name = "gitana-javascript-driver";

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

        "connect": {
            "standalone": {
                "options": {
                    "base": WEB_SERVER_BASE_PATH,
                    "hostname": WEB_SERVER_HOST,
                    "port": WEB_SERVER_PORT,
                    "keepalive": true,
                    "middleware": middleware
                },
                "proxies": [{
                    "context": "/proxy",
                    "host": PROXY_HOST,
                    "port": PROXY_PORT,
                    "timeout": PROXY_TIMEOUT,
                    "https": false,
                    "changeOrigin": true,
                    "xforward": true,
                    "rewrite": {
                        "^/proxy": ""
                    }
                }]
            }
        },

        "aws_s3": {
            "options": {
                "accessKeyId": awsConfig.key,
                "secretAccessKey": awsConfig.secret,
                "region": awsConfig.region,
                "uploadConcurrency": 5,
                "downloadConcurrency": 5
            },
            "clean_version": {
                "options": {
                    "bucket": awsConfig.bucket
                },
                "files": [{
                    "dest": path.join(name, pkg.version),
                    "action": "delete"
                }]
            },
            "clean_latest": {
                "options": {
                    "bucket": awsConfig.bucket
                },
                "files": [{
                    "dest": path.join(name, "latest"),
                    "action": "delete"
                }]
            },
            "publish_version": {
                "options": {
                    "bucket": awsConfig.bucket
                },
                "files": [{
                    "expand": true,
                    "cwd": "dist/",
                    "src": ['**/*'],
                    "dest": path.join(name, pkg.version)
                }]
            },
            "publish_latest": {
                "options": {
                    "bucket": awsConfig.bucket
                },
                "files": [{
                    "expand": true,
                    "cwd": "dist/",
                    "src": ['**/*'],
                    "dest": path.join(name, "latest")
                }]
            }
        },

        "invalidate_cloudfront": {
            "options": {
                "key": awsConfig.key,
                "secret": awsConfig.secret,
                "distribution": awsConfig.cloudfrontDistributionIds[name]
            },
            "production_version": {
                "files": [{
                    "expand": true,
                    "cwd": "dist/",
                    "src": ["**/*"],
                    "filter": "isFile",
                    "dest": path.join(name, pkg.version)
                }]
            },
            "production_latest": {
                "files": [{
                    "expand": true,
                    "cwd": "dist/",
                    "src": ["**/*"],
                    "filter": "isFile",
                    "dest": path.join(name, "latest")
                }]
            }
        },

        "bumpup": {
            "files": [
                "package.json"
            ]
        }

    });
};
