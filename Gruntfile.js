module.exports = function(grunt) {

    var path = require("path");

    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-invalidate-cloudfront');
    grunt.loadNpmTasks('grunt-bumpup');

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

    // config
    grunt.initConfig({

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
