import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("node6", function() {

    it("Node field querying.", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch

                // create a few nodes
                this.createNode({
                    "title": "First Node Title",
                    "description": "First Node Description",
                    "author": "Joe",
                    "tag": "booya"
                });
                this.createNode({
                    "title": "Second Node Title",
                    "description": "Second Node Description",
                    "author": "Joe",
                    "tag": "booya"
                });
                this.createNode({
                    "title": "Third Node Title",
                    "description": "Third Node Description",
                    "author": "Joe",
                    "tag": "booya"
                });

                // test out pagination
                // query for the nodes to get a result set
                // limit to skip 1, size 1
                this.queryNodes({
                    "tag": "booya",
                    "_fields": {
                        "title": 1,
                        "description": 1,
                        "_system": 1
                    }
                }, {
                    "limit": 1,
                    "offset": 1
                }).count(function(count) {
                    t.assert.ok(count === 1, "Found one node");
                }).then(function() {
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
