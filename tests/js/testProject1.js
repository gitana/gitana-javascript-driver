(function($) {

    module("project1");

    // Test case : Project 1
    _asyncTest("Project 1", function()
    {


        expect(4);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            var val = "val-" + new Date().getTime();

            // NOTE: this = platform

            // create a stack
            var stack = null;
            this.createStack().then(function() {
                stack = this;
            });

            this.then(function() {

                // create repository and domain and assign each to stack
                this.createRepository().then(function() {
                    this.subchain(stack).assignDataStore(this);
                });
                this.createDomain().then(function() {
                    this.subchain(stack).assignDataStore(this);
                });

                // create project #1
                var project1 = null;
                this.createProject({ "prop": val }).then(function() {
                    project1 = this;
                });

                // create project #2 for stack
                var project2 = null;
                this.createProject({ "stackId": stack.getId(), "prop": val }).then(function() {
                    project2 = this;
                });

                // create project #3 for stack
                var project3 = null;
                this.createProject({ "stackId": stack.getId(), "prop": val }).then(function() {
                    project3 = this;
                });

                this.then(function() {

                    var platform = this;

                    // query for projects
                    this.queryProjects({ "prop": val }).count(function(count) {
                        equal(count, 3, "Found 3 projects");
                    });

                    // delete project #1
                    this.subchain(project1).del();

                    // query for projects
                    this.queryProjects({ "prop": val }).count(function(count) {
                        equal(count, 2, "Found 2 projects");
                    });

                    // try to delete the stack
                    // this should fail
                    this.subchain(stack).trap(function() {
                        ok(true, "Caught, unable to delete stack");

                        Chain(platform).then(function() {

                            // delete projects
                            this.subchain(project2).del();
                            this.subchain(project3).del();

                            // query for projects
                            this.queryProjects({ "prop": val }).count(function(count) {
                                equal(count, 0, "Found 0 projects");

                                success();
                            });

                        });

                    }).del().then(function() {
                        ok(false, "Should never get here!");
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
