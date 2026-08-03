import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("branch1", function() {

    it("Branch CRUD operations", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(4);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().then(function() {

                // NOTE: this = repository

                // read the master branch
                this.readBranch("master").then(function() {
                    t.assert.ok(true, "Read master branch");
                });

                // create the branch
                var branch = null;
                this.createBranch("master", "0:root").then(function() {
                    t.assert.ok(true, "Created new branch");

                    branch = this;

                    // update the branch
                    this["description"] = "illimani";
                    this.update().reload().then(function() {
                        t.assert.equal(this["description"], "illimani", "Property update succeeded");
                    });
                });

                // list branches to verify there are now two
                this.listBranches().count(function(count) {
                    t.assert.equal(count, 2, "Correct number of branches");
                });

                // and then...
                // NOTE: necessary because we subchain the "branch" variable which gets populated above
                this.then(function() {

                    // subchain on the branch
                    this.subchain(branch).then(function() {

                        // NOTE: this = branch

                        this.del();
                    });

                    // list branches to verify there is now only one
                    this.listBranches().count(function(count) {
                       // NOTE: there is no support for delete branch so this still will return 2
                    });

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
