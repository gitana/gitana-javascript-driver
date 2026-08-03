import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("node3", function() {

    it("Node bulk deletion", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch

                // create a few nodes
                var nodeIds = [];
                this.createNode().then(function() {
                    nodeIds.push(this.getId());
                });
                this.createNode().then(function() {
                    nodeIds.push(this.getId());
                });
                this.createNode().then(function() {
                    nodeIds.push(this.getId());
                });

                // now delete
                this.then(function() {
                    this.deleteNodes(nodeIds).then(function() {
                        t.assert.ok(true, "deleted nodes");
                    })
                });

                // now try to read them back
                this.then(function() {
                    this.trap(function(err) {
                        success();
                    });

                    // this throws
                    this.readNode(nodeIds[0]);
                });
            });

            var success = function()
            {
                start();
            };
        });
    });
});
