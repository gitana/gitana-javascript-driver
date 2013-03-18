(function($) {

    module("applicationDeployment1");

    // Test case : Application Deployment 1
    test("Application Deployment 1", function()
    {
        start();
        /*
        stop();

        expect(6);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // create a web host to store deployments to "cloudcms.net"
            var webhost = null;
            this.createWebHost({
                "deployerType": "cloudcms.net"
            }).then(function() {
                webhost = this;
            });

            this.then(function() {

                var subdomain = "gitana-build-test-" + new Date().getTime();

                // create an application that deploys the "test" application
                var application = null;
                this.createApplication({
                    "title": "Test Application",
                    "deployments": {
                        "live": {
                            "webhost": webhost.getId(),
                            "subdomain": subdomain,
                            "domain": "cloudcms.net"//,
                            //"clientKey": null,
                            //"authGrantId": null
                        }
                    },
                    "source": {
                        "type": "github",
                        "public": true,
                        "uri": "git@github.com:gitana/cloudcms-application-test.git"
                    }
                }).then(function() {

                    application = this;

                    // deploy the app
                    this.deploy("live").then(function() {

                        var deployedApp = this;

                        // this == deployed application
                        equal(this["applicationId"], application.getId(), "Application ID match");
                        equal(this["deploymentKey"], "live", "Deployment Key match");
                        equal(this["deploymentWebhost"], webhost.getId(), "Deployment web host match");
                        equal(this["deploymentDomain"], "cloudcms.net", "Deployment domain match");
                        equal(this["deploymentSubdomain"], subdomain, "Deployment subdomain match");

                        var url = this["urls"][0];

                        ok(url, "Found url");

                        // undeploy
                        Chain(deployedApp).undeploy().then(function() {
                            start();
                        });

                    });
                });
            });
        });
        */

    });

}(jQuery) );
