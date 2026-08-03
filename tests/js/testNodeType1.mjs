import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("nodeType1", function() {

    it("Node Type 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
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
                        t.assert.equal("custom:type1", this.getTypeQName(), "Successfully switched type");
                    });

                    // switch the type of the node again
                    this.changeTypeQName("custom:type2").then(function() {
                        t.assert.equal("custom:type2", this.getTypeQName(), "Successfully switched type");
                    });
                });

                // now query by type
                this.queryNodes({
                    "_type": "custom:type2"
                }).count(function(count) {
                    t.assert.equal(1, count, "Found 1 node of type custom:type2");
                });


                this.then(function() {
                    success();
                });

            });

            var success = function() {
                start();
            };
        });
    });
});
