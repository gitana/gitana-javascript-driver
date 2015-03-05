(function($) {

    module("serviceDescriptor1");

    // Test case : Service Descriptor 1
    _asyncTest("Service Descriptor 1", function()
    {
        expect(1);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            // NOTE: type = AWS_SNS, AWS_S3, AWS_ROUTE53
            // NOTE: family = DEPLOYMENT_NOTIFICATION_SERVICE, BINARY_STORAGE_SERVICE

            // create service descriptor #1
            this.createServiceDescriptor({
                "key": "abc1",
                "type": "AWS_SNS",
                "family": "DEPLOYMENT_NOTIFICATION_SERVICE",
                "configuration": {
                    "p1": "v1"
                }
            });

            // create service descriptor #2
            this.createServiceDescriptor({
                "key": "abc2",
                "type": "AWS_SNS",
                "family": "DEPLOYMENT_NOTIFICATION_SERVICE",
                "configuration": {
                    "p2": "v2"
                }
            });

            // create service descriptor #3
            this.createServiceDescriptor({
                "key": "abc3",
                "type": "AWS_S3",
                "family": "DEPLOYMENT_NOTIFICATION_SERVICE",
                "configuration": {
                    "p3": "v3"
                }
            });

            // create service descriptor #4
            this.createServiceDescriptor({
                "key": "abc4",
                "type": "AWS_S3",
                "family": "DEPLOYMENT_NOTIFICATION_SERVICE",
                "configuration": {
                    "p4": "v4"
                }
            });

            // create service descriptor #5
            var sd1 = null;
            this.createServiceDescriptor({
                "key": "abc5",
                "type": "AWS_ROUTE53",
                "family": "BINARY_STORAGE_SERVICE",
                "configuration": {
                    "p5": "v5"
                }
            }).then(function() {
                sd1 = this;
            });

            // query
            this.queryServiceDescriptors({
                "type": "AWS_ROUTE53"
            }).count(function(c1) {
                ok(c1 === 1, "Query works!");
            });

            // delete the service descriptor
            this.then(function() {
                sd1["configuration"]["p6"] = "v6";
                this.subchain(sd1).update().then(function() {
                    this.del().then(function() {
                        success();
                    });
                });
            });
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
