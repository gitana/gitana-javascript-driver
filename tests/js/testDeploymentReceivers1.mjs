import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("deploymentReceivers1", function() {

    it("Deployment Receivers 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        return guard(t, function(start) {
            var deploymentReceiver = null;
            var branchRef = "testname-" + new Date().getTime();

            var platform = GitanaTest.authenticateFullOAuth();
            platform.then(function () {

                // NOTE: this = platform

                // first: create a deployment receiver
                this.createDeploymentReceiver({
                    "title": "test1",
                    "description": "Testing deployment receiver #1",
                    "type": "branch",
                    "config": {
                        "branchRef": branchRef
                    }
                }).then(function(){
                    deploymentReceiver = this;
                    t.assert.ok(true, "Successfully Created Deployment Receiver #1");
                });

                this.then(function () {

                    // then test out query, list, read and delete operations
                    this.queryDeploymentReceivers({"config.branchRef": branchRef}).count(function(count) {
                        t.assert.equal(1, count, "Count of deployment receivers is 1");
                    });

                    this.readDeploymentReceiver(deploymentReceiver._doc).then(function(){
                        this.category = "blue";
                        this.update();
                    });

                    this.queryDeploymentReceivers({"category": "blue"}).count(function(count) {
                        t.assert.equal(1, count, "Count of deployment receivers with category as blue is 1");
                    });

                    this.readDeploymentReceiver(deploymentReceiver._doc).del().then(function(){
                        t.assert.ok(true, "Successfully deleted deployment receiver");

                    });

                    this.queryDeploymentReceivers({"config.branchRef": branchRef}).count(function(count) {
                        t.assert.equal(0, count, "Count of deployment receivers is 0 after the delete function");
                    });

                });

                this.then(function () {
                    success();
                });

                var success = function () {
                    start();
                };

            });
        });
    });
});
