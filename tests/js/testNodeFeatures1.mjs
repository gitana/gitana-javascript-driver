import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("nodeFeatures1", function() {

    it("Node Features 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(4);

        return guard(t, function(start) {
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
                        t.assert.ok(has, "First check - has custom:authorable feature");
                    });

                    this.then(function() {
                        t.assert.ok(this.hasFeature("custom:authorable"), "Second check - has custom:authorable feature");
                    });

                });

                // query for nodes with this feature
                // should find 1
                this.queryNodes({
                    "_features.custom:authorable": {
                        "$exists": true
                    }
                }).count(function(count) {
                    t.assert.equal(1, count, "Found 1 authorable node");
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
                        t.assert.equal(0, count, "Found 0 authorable nodes");
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
    });
});
