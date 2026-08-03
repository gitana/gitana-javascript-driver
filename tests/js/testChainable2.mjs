import { describe, it } from "node:test";
import { Gitana, GitanaTest, Chain, guard } from "../support.mjs";

describe("chainable2", function() {

    it("Chainable 2", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(10);

        return guard(t, function(start) {
            //Chain.debug = true;

            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().then(function() {

                // NOTE: this = repository

                // create 8 branches in serial
                this.createBranch("master", "0:root");
                this.createBranch("master", "0:root");
                this.createBranch("master", "0:root");
                this.createBranch("master", "0:root");
                this.createBranch("master", "0:root");
                this.createBranch("master", "0:root");
                this.createBranch("master", "0:root");
                this.createBranch("master", "0:root");

                // update all of the branches in serial each()
                var x = 0;
                this.listBranches().each(function() {

                    // update branch
                    var title = "branch-title-" + x++;
                    this["title"] = title;

                    this.update().then(function() {
                        t.assert.equal(this["title"], title, "Title matched");
                    });

                });

                // list all of the branches and test keepOne()
                this.listBranches().keepOne().then(function() {
                    t.assert.ok(this.objectType() == "Gitana.Branch", "Found a single branch");
                    success();
                });
            });

            var success = function()
            {
                start();
            }
        });
    });
});
