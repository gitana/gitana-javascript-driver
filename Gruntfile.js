module.exports = function(grunt) {

    var fs = require("fs");
    var path = require("path");

    var WEB_SERVER_HOST = "test.cloudcms.com";
    var WEB_SERVER_PORT = 8000;
    var WEB_SERVER_BASE_PATH = ".";

    var PROXY_HOST = "test.cloudcms.com";
    var PROXY_PORT = 8080;
    var PROXY_TIMEOUT = 5 * 60 * 1000;

    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-closure-compiler');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-invalidate-cloudfront');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-bumpup');

    // register one or more task lists (you should ALWAYS have a "default" task list)
    grunt.registerTask('test', ['configureProxies:testing', 'connect:testing', 'qunit']);
    grunt.registerTask('web', ['configureProxies:standalone', 'connect:standalone']);
    grunt.registerTask('closure', ['closure-compiler']);
    grunt.registerTask('cdn', ['aws_s3:clean', 'aws_s3:publish', 'invalidate_cloudfront:production']);
    grunt.registerTask('bump', ['bumpup']);

    var pkg = grunt.file.readJSON('package.json');
    var awsConfig = grunt.file.readJSON("../settings/__aws.json");
    var githubConfig = grunt.file.readJSON("../settings/__github.json");

    process.env.GITHUB_USERNAME = githubConfig.username;
    process.env.GITHUB_PASSWORD = githubConfig.password;

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

    grunt.registerTask("writeVersionProperties", "Writes a version.properties file for ant to pick up", function() {

        var pkg = grunt.file.readJSON('package.json');
        var version = pkg.version;

        grunt.file.delete("version.properties");
        fs.writeFileSync("version.properties", "version=" + version);
    });

    // applies some cosmetic spacing
    grunt.event.on('qunit.begin', function (url) {
        grunt.log.ok("");
    });

    // config
    grunt.initConfig({

        "qunit": {
            "all": {
                "options": {
                    "timeout": 60000, // let them timeouts run long (1 minute)
                    "urls": [
                        "http://" + WEB_SERVER_HOST + ":" + WEB_SERVER_PORT + "/tests/index.html"
                    ],
                    "force": true,
                    "--cookies-file": "build/cookies.txt"
                }
            }
        },

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
            },
            "testing": {
                "options": {
                    "base": WEB_SERVER_BASE_PATH,
                    "hostname": WEB_SERVER_HOST,
                    "port": WEB_SERVER_PORT,
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

        "jshint": {
            "gitana": {
                "options": {
                    "multistr": true,
                    "scripturl": true,
                    "laxcomma": true,
                    "-W069": true, // "['variable'] is better written in dot notation
                    "-W041": true, // "Use '===' to compare with null or 0
                    "-W004": true, // duplicate variables
                    "-W014": true, // line breaking +
                    "-W065": true, // radix
                    "-W083": true  // functions in loops
                },
                src: ["js/gitana/**/*.js"]
            }
        },

        "closure-compiler": {
            "console": {
                "js": "build/package/js/gitana.js",
                "jsOutputFile": "build/package/js/gitana.closure.js",
                "maxBuffer": 10000,
                "noreport": true,
                "options": {
                    "compilation_level": "ADVANCED_OPTIMIZATIONS"
                    //language_in: 'ECMASCRIPT5_STRICT'
                    //compilation_level: 'SIMPLE_OPTIMIZATIONS'
                }
            }
        },

        "jsdoc": {
            "dist": {
                "src": [
                    "js/gitana/**/*.js",
                    "README.md"
                ],
                "options": {
                    "destination": "./dist/jsdoc",
                    "template": "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    "configure": "jsdoc.conf.json"
                }
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
            "clean": {
                "options": {
                    "bucket": awsConfig.bucket
                },
                "files": [{
                    "dest": path.join(name, pkg.version),
                    "action": "delete"
                }]
            },
            "publish": {
                "options": {
                    "bucket": awsConfig.bucket
                },
                "files": [{
                    "expand": true,
                    "cwd": "dist/",
                    "src": ['**/*'],
                    "dest": path.join(name, pkg.version)
                }]
            }
        },

        "invalidate_cloudfront": {
            "options": {
                "key": awsConfig.key,
                "secret": awsConfig.secret,
                "distribution": awsConfig.cloudfrontDistributionIds[name]
            },
            "production": {
                "files": [{
                    "expand": true,
                    "cwd": "dist/",
                    "src": ["**/*"],
                    "filter": "isFile",
                    "dest": path.join(name, pkg.version)
                }]
            }
        },

        bumpup: {
            files: [
                "package.json",
                "bower.json"
            ]
        },

        release: {
            options: {
                bump: false,
                file: "package.json",
                add: true,
                commit: true,
                tag: true,
                push: true,
                pushTags: true,
                npm: false,
                npmtag: false,
                indentation: "    ",
                //folder: 'folder/to/publish/to/npm',
                tagName: "<%= version %>",
                commitMessage: "release <%= version %>",
                tagMessage: "tagging version <%= version %>",
                github: {
                    repo: "gitana/" + name,
                    usernameVar: "GITHUB_USERNAME",
                    passwordVar: "GITHUB_PASSWORD"
                }
            }
        }

    });
};