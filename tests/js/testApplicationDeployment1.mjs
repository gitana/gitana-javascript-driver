import { describe, it } from "node:test";
import { Gitana, GitanaTest, Chain, guard } from "../support.mjs";

describe("applicationDeployment1", function() {

    it("Application Deployment 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(6);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth(null, function(err) {
                return start();
            });
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
                            t.assert.equal(this["applicationId"], application.getId(), "Application ID match");
                            t.assert.equal(this["deploymentKey"], "test", "Deployment Key match");
                            t.assert.equal(this["deploymentWebhost"], webhost.getId(), "Deployment web host match");
                            t.assert.equal(this["deploymentDomain"], "cloudcms.net", "Deployment domain match");
                            t.assert.equal(this["deploymentSubdomain"], "gitana-build-test", "Deployment subdomain match");

                            var url = this["urls"][0];

                            t.assert.ok(url, "Found url");

                            // undeploy
                            Chain(deployedApp).undeploy().then(function() {
                                start();
                            });

                        });
                    });
                });
            });
        });
    });
});
