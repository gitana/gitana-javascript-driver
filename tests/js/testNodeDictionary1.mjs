import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("nodeDictionary1", function() {

    it("Dictionary operations", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(4);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch

                // list all definitions
                this.listDefinitions({
                    "limit": -1
                }).count(function(count) {
                    t.assert.ok(count > 0, "Found definitions");
                });

                // list type definitions
                this.listDefinitions("type", {
                    "limit": -1
                }).count(function(count) {
                    t.assert.ok(count > 0, "Found type definitions");
                });

                // list association type definitions
                this.listDefinitions("association", {
                    "limit": -1
                }).count(function(count) {
                    t.assert.ok(count > 0, "Found association type definitions");
                });

                // list feature definitions
                this.listDefinitions("feature", {
                    "limit": -1
                }).count(function(count) {
                    t.assert.ok(count > 0, "Found feature definitions");
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
