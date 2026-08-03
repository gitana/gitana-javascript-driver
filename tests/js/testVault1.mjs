import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("vault1", function() {

    it("Vault CRUD operations", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(6);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                var vault = null;

                // first: create, update, reload domain
                this.createVault().then(function() {

                    t.assert.ok(true, "Successfully created");

                    // set some properties
                    this["title"] = "Test Title";
                    this["description"] = "Test Description";
                    this["custom"] = "Test Value";

                    this.update().reload().then(function() {

                        t.assert.equal(this["title"], "Test Title", "Property #1 match");
                        t.assert.equal(this["description"], "Test Description", "Property #2 match");
                        t.assert.equal(this["custom"], "Test Value", "Property #3 match");

                        vault = this;
                    });
                });

                // then test out deletes
                this.listVaults({
                    "limit": -1
                }).then(function() {

                    var vault2 = this.get(vault.getId());
                    t.assert.ok(vault2, "Successfully retrieved from list");

                    this.subchain(vault2).del().then(function() {

                        t.assert.ok(true, "Successfully deleted");

                        // signal end of test?
                        start();

                    });
                });
            });
        });
    });
});
