(function($) {

    module("deploymentReceivers1");

    // Test case : Deployment Receivers 1 CRUD operations
    _asyncTest("Deployment Receivers 1", function() {

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
                ok(true, "Successfully Created Deployment Receiver #1");
            });

            this.then(function () {

                // then test out query, list, read and delete operations
                this.queryDeploymentReceivers({"config.branchRef": branchRef}).count(function(count) {
                    equal(1, count, "Count of deployment receivers is 1");
                });

                this.readDeploymentReceiver(deploymentReceiver._doc).then(function(){
                    this.category = "blue";
                    this.update();
                });

                this.queryDeploymentReceivers({"category": "blue"}).count(function(count) {
                    equal(1, count, "Count of deployment receivers with category as blue is 1");
                });

                this.readDeploymentReceiver(deploymentReceiver._doc).del().then(function(){
                    ok(true, "Successfully deleted deployment receiver");

                });

                this.queryDeploymentReceivers({"config.branchRef": branchRef}).count(function(count) {
                    equal(0, count, "Count of deployment receivers is 0 after the delete function");
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

}(jQuery) );