import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("node7", function() {

    it("Node pagination", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(5);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch

                // create a few nodes
                this.createNode({
                    "tag": "abc"
                });
                this.createNode({
                    "tag": "abc"
                });
                this.createNode({
                    "tag": "abc"
                });
                this.createNode({
                    "tag": "abc"
                });
                this.createNode({
                    "tag": "abc"
                });

                // now query back
                this.queryNodes({
                    "tag": "abc"
                }).totalRows(function(total) {
                    t.assert.equal(total, 5, "Pass 1 - Found 5 total rows");
                });

                // query again with pagination
                this.queryNodes({
                    "tag": "abc"
                }, {
                    "limit": 2,
                    "skip": 2
                }).totalRows(function(total) {
                   t.assert.equal(total, 5, "Pass 2 - Found 5 total rows");
                }).count(function(count) {
                   t.assert.equal(count, 2, "Pass 2 - Count was 2");
                });

                // query again with fields
                this.queryNodes({
                    "tag": "abc",
                    "_fields": {
                        "tag": 1
                    }
                }, {
                    "limit": 2,
                    "skip": 2
                }).totalRows(function(total) {
                    t.assert.equal(total, 5, "Pass 3 - Found 5 total rows");
                }).count(function(count) {
                    t.assert.equal(count, 2, "Pass 3 - Count was 2");
                });

                this.then(function() {
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
