import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("nodeKeepOneError1", function() {

    it("nodeKeepOneError1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch
                var branch = this;

                // query for empty set
                this.subchain(branch).trap(function(e) {

                    t.assert.ok(true, "Error handler ran successfully");

                    success();
                    return false;

                }).queryNodes({
                    "abdbasd": "ASDADS"
                }).keepOne().then(function() {

                    // should never get here
                    t.assert.ok(false, "Should never get here");

                });
            });

            var success = function()
            {
                start();
            };
        });
    });
});
