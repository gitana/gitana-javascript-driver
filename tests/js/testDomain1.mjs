import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("domain1", function() {

    it("Domain CRUD operations", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(6);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // NOTE: this = platform

                var domain = null;

                // first: create, update, reload domain
                this.createDomain().then(function() {

                    t.assert.ok(true, "Successfully created");

                    // set some properties
                    this["title"] = "Test Title";
                    this["description"] = "Test Description";
                    this["custom"] = "Test Value";

                    this.update().reload().then(function() {

                        t.assert.equal(this["title"], "Test Title", "Property #1 match");
                        t.assert.equal(this["description"], "Test Description", "Property #2 match");
                        t.assert.equal(this["custom"], "Test Value", "Property #3 match");

                        domain = this;
                    });
                });

                // then test out deletes
                this.listDomains({
                    "limit": -1
                }).then(function() {

                    var domain2 = this.get(domain.getId());
                    t.assert.ok(domain2, "Successfully retrieved from list");

                    this.subchain(domain2).del().then(function() {

                        t.assert.ok(true, "Successfully deleted");

                        // signal end of test?
                        start();

                    });
                });
            });
        });
    });
});
