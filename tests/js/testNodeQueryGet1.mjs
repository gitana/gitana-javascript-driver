import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("nodeQueryGet1", function() {

    it("Node Query Get operations", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch

                // create a few nodes
                this.createNode({
                    "prop": "val1"
                });
                this.createNode({
                    "prop": "val1"
                });
                this.createNode({
                    "prop": "val2"
                });

                Gitana.PREFER_GET_OVER_POST = true;

                this.queryNodes({
                    "prop": "val1"
                }).count(function (c) {
                    t.assert.ok(c === 2, "Get query worked");

                    Gitana.PREFER_GET_OVER_POST = false;

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
