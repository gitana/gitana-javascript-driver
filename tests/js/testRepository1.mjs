import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("repository1", function() {

    it("Repository CRUD operations", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(6);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // NOTE: this = platform

                var repo = null;

                // first: create, update, reload repository
                this.createRepository().then(function() {

                    t.assert.ok(true, "Successfully created");

                    // set some properties
                    this["title"] = "Test Title";
                    this["description"] = "Test Description";
                    this["custom"] = "Test Value";

                    this.update().reload().then(function() {

                        t.assert.equal(this["title"], "Test Title", "Property #1 match");
                        t.assert.equal(this["description"], "Test Description", "Property #2 match");
                        t.assert.equal(this["custom"], "Test Value", "Property #3 match");

                        repo = this;
                    });
                });

                // then test out deletes
                this.listRepositories({
                    "limit": -1
                }).then(function() {

                    var repo2 = this.get(repo.getId());
                    t.assert.ok(repo2, "Successfully retrieved from list");

                    this.subchain(repo2).del().then(function() {

                        t.assert.ok(true, "Successfully deleted");

                        // signal end of test?
                        start();

                    });
                });
            });
        });
    });
});
