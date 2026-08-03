import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("archive1", function() {

    it("Archive CRUD operations", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                var vault = null;

                // create a vault
                this.createVault().then(function() {

                    t.assert.ok(true, "Successfully created");

                    // TODO: how to test archive operations if we can't upload archives...?

                    start();
                });

            });
        });
    });
});
