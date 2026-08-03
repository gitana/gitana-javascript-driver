import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("node5", function() {

    it("Node field querying.", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(10);

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

                // query for the nodes to get a result set
                // verify result set
                this.queryNodes({
                    "tag": "booya",
                    "_fields": {
                        "title": 1,
                        "description": 1,
                        "_system": 1
                    }
                }).count(function(count) {
                    t.assert.ok(count === 3, "Found three nodes");
                }).each(function() {
                    t.assert.ok(this.title, "Does have title");
                    t.assert.ok(this.description, "Does have description");
                    t.assert.ok(!this.author, "Does not have author");
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
