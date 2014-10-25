(function($) {

    /**
     * Tests out node transaction deletes.
     */
    module("nodeTransaction5");

    return;

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

                    // create a bunch of nodes and remember the ids
                    this.createNode({
                        "property1": "value1"
                    });
                    this.createNode({
                        "property1": "value1"
                    });
                    this.createNode({
                        "property1": "value1"
                    });
                    this.createNode({
                        "property1": "value1"
                    });
                    this.createNode({
                        "property1": "value1"
                    });
                    this.createNode({
                        "property1": "value1"
                    });
                    this.createNode({
                        "property1": "value1"
                    });
                    this.createNode({
                        "property1": "value1"
                    });
                    this.createNode({
                        "property1": "value1"
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
                    "property1": "value1"
                });
                t.write({
                    "property2": "value2"
                }, {
                    "title": "Hello!"
                });

                // commit
                t.commit().then(function(results) {

                    Chain(branch).then(function() {

                        this.queryNodes({
                            "property1": "value1"
                        }).count(function(count) {
                            ok(count === 0, "All deletes processed");
                        });

                        this.queryOne({
                            "property2": "value2"
                        }).then(function() {
                            ok(this.title == "Hello!", "Property was updated");
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
