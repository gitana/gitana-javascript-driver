(function($) {

    module("nodeType1");

    // Test case : Node Type 1
    _asyncTest("Node Type 1", function() {



        expect(3);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // define a type (custom:type1)
            this.createNode({
                "_qname": "custom:type1",
                "_type": "d:type",
                "type": "object",
                "properties": {
                    "author": {
                        "type": "string"
                    }
                }
            });

            // define a type (custom:type2)
            this.createNode({
                "_qname": "custom:type2",
                "_type": "d:type",
                "type": "object",
                "properties": {
                    "header": {
                        "type": "string"
                    }
                }
            });

            // create a node
            this.createNode().then(function() {

                // switch the type of the node
                this.changeTypeQName("custom:type1").then(function() {
                    equal("custom:type1", this.getTypeQName(), "Successfully switched type");
                });

                // switch the type of the node again
                this.changeTypeQName("custom:type2").then(function() {
                    equal("custom:type2", this.getTypeQName(), "Successfully switched type");
                });
            });

            // now query by type
            this.queryNodes({
                "_type": "custom:type2"
            }).count(function(count) {
                equal(1, count, "Found 1 node of type custom:type2");
            });


            this.then(function() {
                success();
            });

        });

        var success = function() {
            start();
        };

    });

}(jQuery) );
