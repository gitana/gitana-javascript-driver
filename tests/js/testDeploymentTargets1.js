(function($) {

    module("deploymentTargets1");

    // Test case : Deployment Targets 1 CRUD operations
    _asyncTest("Deployment Targets 1", function() {

        var deploymentTarget = null;
        var name = "testname-" + new Date().getTime();

        var platform = GitanaTest.authenticateFullOAuth();
        platform.then(function () {

            // NOTE: this = platform

            // first: create a deployment target
            this.createDeploymentTarget({
                "title": "Test Deployment Targets",
                "description": "Testing Deployment Target 1",
                "type": "Branch",
                "name": name
            }).then(function(){
                deploymentTarget = this;
                ok(true, "Successfully Created Deployment Target");
            });

            this.then(function () {

                // then test out query, list, read and delete operations
                this.queryDeploymentTargets({"name": name}).count(function(count) {
                    equal(1, count, "Count of deployment targets is 1");
                });

                this.listDeploymentTargets().count(function (count) {
                    equal(1, count, "The count of deployment targets is 3");

                });

                this.readDeploymentTarget(deploymentTarget._doc).then(function(){
                    this.category = "blue";
                    this.update();
                });

                this.queryDeploymentTargets({"category": "blue"}).count(function(count) {
                    equal(1, count, "Count of deployment targets with category value as blue is 1");
                });


                this.readDeploymentTarget(deploymentTarget._doc).del().then(function(){
                    ok(true, "Successfully deleted");

                });

                this.queryDeploymentTargets({"name": name}).count(function(count) {
                    equal(0, count, "Count of deployment targets is 0 after the delete function");
                });

            });

            platform.then(function () {
                success();
            });

            var success = function () {
                start();
            };

        });
    });

}(jQuery) );