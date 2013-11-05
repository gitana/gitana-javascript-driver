(function($) {

    module("nodeFeatures1");

    // Test case : Node Features 1
    _asyncTest("Node Features 1", function() {



        expect(4);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // define a feature (custom:authorable)
            this.createNode({
                "_qname": "custom:authorable",
                "_type": "d:feature",
                "type": "object",
                "properties": {
                    "author": {
                        "type": "string"
                    }
                }
            });

            // create a node
            var nodeId = null;
            this.createNode().then(function() {

                nodeId = this.getId();

                // add the authorable feature
                this.addFeature("custom:authorable");

                this.hasFeature("custom:authorable", function(has) {
                    ok(has, "First check - has custom:authorable feature");
                });

                this.then(function() {
                    ok(this.hasFeature("custom:authorable"), "Second check - has custom:authorable feature");
                });

            });

            // query for nodes with this feature
            // should find 1
            this.queryNodes({
                "_features.custom:authorable": {
                    "$exists": true
                }
            }).count(function(count) {
                equal(1, count, "Found 1 authorable node");
            });


            this.then(function() {

                // remove the feature
                this.readNode(nodeId).then(function() {
                    this.removeFeature("custom:authorable");
                });

                // query for nodes with this feature
                // should find 0
                this.queryNodes({
                    "_features.custom:authorable": {
                        "$exists": true
                    }
                }).count(function(count) {
                    equal(0, count, "Found 0 authorable nodes");
                });

                this.then(function() {
                    success();
                });

            });
        });

        var success = function() {
            start();
        };

    });

}(jQuery) );
