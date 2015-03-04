(function($) {

    /**
     * Tests out node transaction deletes.
     */
    module("nodeTransaction5");

    // Test case : Node Transaction 5
    _asyncTest("Node Transaction 5", function()
    {
        expect(2);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // create a repository and get the master branch
            var branch = null;
            this.createRepository().then(function() {

                this["enableSocialAssembly"] = true;
                this.update();

                this.readBranch("master").then(function() {
                    branch = this;

                    // create a bunch of nodes
                    this.createNode({
                        "property1": "value11",
                        "x1": "y1"
                    });
                    this.createNode({
                        "property1": "value12",
                        "x1": "y1"
                    });
                    this.createNode({
                        "property1": "value13",
                        "x1": "y1"
                    });
                    this.createNode({
                        "property1": "value14",
                        "x1": "y1"
                    });
                    this.createNode({
                        "property1": "value15",
                        "x1": "y1"
                    });
                    this.createNode({
                        "property1": "value16",
                        "x1": "y1"
                    });
                    this.createNode({
                        "property1": "value17",
                        "x1": "y1"
                    });
                    this.createNode({
                        "property1": "value18",
                        "x1": "y1"
                    });
                    this.createNode({
                        "property1": "value19",
                        "x1": "y1"
                    });
                    this.createNode({
                        "property2": "value2"
                    });
                });
            });

            this.then(function() {

                // create a transaction to delete everything

                var t = Gitana.transactions().create(branch);
                t.del({
                    "_existing": {
                        "property1": "value11"
                    }
                });
                t.del({
                    "_existing": {
                        "property1": "value12"
                    }
                });
                t.del({
                    "_existing": {
                        "property1": "value13"
                    }
                });
                t.del({
                    "_existing": {
                        "property1": "value14"
                    }
                });
                t.del({
                    "_existing": {
                        "property1": "value15"
                    }
                });
                t.del({
                    "_existing": {
                        "property1": "value16"
                    }
                });
                t.del({
                    "_existing": {
                        "property1": "value17"
                    }
                });
                t.del({
                    "_existing": {
                        "property1": "value18"
                    }
                });
                t.del({
                    "_existing": {
                        "property1": "value19"
                    }
                });
                t.write({
                    "_existing": {
                        "property2": "value2"
                    },
                    "property2": "value2",
                    "title": "Hello!"
                });

                // commit
                t.commit().then(function(results) {

                    Chain(branch).then(function() {

                        this.queryNodes({
                            "x1": "y1"
                        }).count(function(count) {
                            ok(count === 0, "All deletes processed");
                        });

                        this.queryOne({
                            "property2": "value2"
                        }).then(function() {
                            ok(this.title === "Hello!", "Property was updated");
                        });

                        this.then(function() {
                            success();
                        });
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
