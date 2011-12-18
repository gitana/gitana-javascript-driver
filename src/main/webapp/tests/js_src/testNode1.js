(function($) {

    module("node1");

    // Test case : Node CRUD operations.
    test("Node CRUD operations", function()
    {
        stop();

        expect(8);

        var test = this;

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // create a few nodes
            this.createNode();
            this.createNode();
            this.createNode();

            // create a node
            this.createNode().then(function() {

                // NOTE: this = node

                test.node = this;

                ok(true, "Created second node");
            });

            // read the node back
            this.subchain(this).then(function() {

                this.readNode(test.node.getId()).then(function() {
                    ok(true, "Read node back");

                    // NOTE: this = node

                    // update the node
                    this.object["title"] = "lapaz";
                    this.object["description"] = "illimani";
                    this.update().reload().then(function() {

                        // NOTE: this = node

                        equal(this.object["title"], "lapaz", "Matched property #1");
                        equal(this.object["description"], "illimani", "Matched property #2");
                        ok(true, "Updated node");

                        // touch the node
                        this.touch().then(function() {

                            ok(true, "Touched node");

                            // delete the node
                            this.del().then(function() {
                                ok(true, "Deletion succeeded");
                            });

                        });
                    });
                });
            });

            // for giggles, fire off some parallel node creates
            // define thread function
            var f = function()
            {
                this.createNode();
            };
            this.then([f,f,f,f]).then(function() {
                ok(true, "Parallel node create success");
            });

            this.then(function() {
                success();
            });

        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
