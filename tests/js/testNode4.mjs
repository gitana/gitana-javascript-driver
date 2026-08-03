import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("node4", function() {

    it("Node bulk deletion", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch

                // create a few nodes
                this.createNode({
                    "tag": "booya"
                });
                this.createNode({
                    "tag": "booya"
                });
                this.createNode({
                    "tag": "booya"
                });

                // query for the nodes to get a result set
                // then delete right away
                this.queryNodes({
                    "tag": "booya"
                }).del().then(function() {
                    t.assert.ok(true, "deleted nodes");
                });

                this.queryNodes({
                    "tag": "booya"
                }).count(function(count) {
                    success();
                });

            });

            var success = function()
            {
                start();
            };
        });
    });
});
