(function($) {

    module("applicationDeployment1");

    // Test case : Application Deployment 1
    test("Application Deployment 1", function()
    {
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

                // create an application with a "test" deployment
                var application = null;
                this.createApplication({
                    "title": "Test Application",
                    "deployments": {
                        "test": {
                            "webhost": webhost.getId(),
                            "subdomain": "gitana-build-test",
                            "domain": "cloudcms.net"
                        }
                    },
                    "source": {
                        "type": "github",
                        "public": true,
                        "uri": "git@github.com:gitana/app-html5-test.git"
                    }
                }).then(function() {

                    application = this;

                    // deploy the "test" deployment for this app
                    this.deploy("test").then(function() {

                        var deployedApp = this;

                        // this == deployed application
                        equal(this["applicationId"], application.getId(), "Application ID match");
                        equal(this["deploymentKey"], "test", "Deployment Key match");
                        equal(this["deploymentWebhost"], webhost.getId(), "Deployment web host match");
                        equal(this["deploymentDomain"], "cloudcms.net", "Deployment domain match");
                        equal(this["deploymentSubdomain"], "gitana-build-test", "Deployment subdomain match");

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

    });

}(jQuery) );
