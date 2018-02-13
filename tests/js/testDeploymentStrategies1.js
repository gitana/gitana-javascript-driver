(function($) {

    module("deploymentStrategies1");

    // Test case : Deployment Strategies 1 CRUD operations
    _asyncTest("Deployment Strategies 1", function() {

        var deploymentStrategy = null;
        var name = "testname-" + new Date().getTime();

        var platform = GitanaTest.authenticateFullOAuth();
        platform.then(function () {

            // NOTE: this = platform

            // first: create a deployment strategy
            this.createDeploymentStrategy({
                "title": "Testing Deployment Strategies",
                "description": "Testing Deployment Strategy 1",
                "type": "Branch",
                "name": name
            }).then(function(){
                deploymentStrategy = this;
                ok(true, "Successfully Created Deployment Strategy");

            });

            this.then(function () {

                // then test out query, list, read and delete operations
                this.queryDeploymentStrategies({"name": name}).count(function(count) {
                    equal(1, count, "Count of deployment strategies is 1");
                });

                this.listDeploymentStrategies().count(function (count) {
                    equal(2, count, "The count of deployment strategies is 25");

                });

                this.readDeploymentStrategy(deploymentStrategy._doc).then(function(){
                    this.trigger = "yes";
                    this.update();
                });

                this.queryDeploymentStrategies({"trigger": "yes"}).count(function(count) {
                    equal(1, count, "Count of deployment strategies with trigger value as yes is 1");
                });

                this.readDeploymentStrategy(deploymentStrategy._doc).del().then(function(){
                    ok(true, "Successfully deleted");

                });

                this.queryDeploymentStrategies({"name": name}).count(function(count) {
                    equal(0, count, "Count of deployment strategies is 0 after the delete function");
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