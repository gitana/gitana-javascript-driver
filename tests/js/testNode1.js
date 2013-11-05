(function($) {

    module("node1");

    // Test case : Node CRUD operations.
    _asyncTest("Node CRUD operations", function()
    {


        expect(12);

        var test = this;

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // create a few nodes
            this.createNode();
            this.createNode();
            this.createNode();

            // create a node
            this.then(function() {

                this.createNode().then(function() {

                    // NOTE: this = node

                    test.node = this;

                    ok(true, "Created second node");
                });

            });

            // read the node back
            this.subchain(this).then(function() {

                this.readNode(test.node.getId()).then(function() {
                    ok(true, "Read node back");

                    ok(this.stats(), "Node stats field generated");

                    // NOTE: this = node

                    // update the node
                    this["title"] = "lapaz";
                    this["description"] = "illimani";
                    this.update().reload().then(function() {

                        // NOTE: this = node

                        equal(this["title"], "lapaz", "Matched property #1");
                        equal(this["description"], "illimani", "Matched property #2");
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

            // test queryOne()
            this.then(function() {

                this.createNode({"prop": "val1"});
                this.queryNodes({"prop": "val1"}).count(function(count) {
                    equal(count, 1, "Found one using full query");
                });
                this.queryOne({"prop": "val1"}).then(function() {
                    ok(true, "Found one using queryOne");
                });
                this.queryOne({"prop2": "val1"}, function(err) {
                    ok(err, "Caught err flag on queryOne no match");
                    success();
                    //start();
                }).then(function() {
                    ok(false, "This line should never be reached!");
                });
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
