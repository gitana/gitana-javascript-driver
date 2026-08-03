import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("domainPrincipal2", function() {

    it("Domain Principal 2", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(5);

        return guard(t, function(start) {
            var platform = GitanaTest.authenticateFullOAuth();
            platform.readPrimaryDomain().then(function() {

                // NOTE: this = domain

                // count the number of groups
                var count = 0;
                this.listGroups({
                    "limit": -1
                }).each(function() {
                    count++;
                });

                // create a group
                var group1 = null;
                var groupName1 = "group" + new Date().getTime();
                this.createGroup({
                    "name": groupName1
                }).then(function() {
                    group1 = this;
                });

                // list groups and verify size + 1
                var recount = 0;
                this.listGroups({
                    "limit": -1
                }).each(function() {
                    recount++;
                }).then(function() {
                    t.assert.equal(recount, count + 1, "Size incremented by 1");
                });

                // updates
                this.then(function() {

                    this.subchain(group1).then(function() {

                        // update some properties
                        this["title"] = "Test Title";
                        this["description"] = "Test Description";
                        this["customProperty"] = "Custom Value";

                        this.update().reload().then(function() {

                            // check properties
                            t.assert.equal("Test Title", this["title"]);
                            t.assert.equal("Test Description", this["description"]);
                            t.assert.equal("Custom Value", this["customProperty"]);

                            // now delete
                            this.del().then(function() {
                                t.assert.ok(true, "Successfully deleted");
                                success();
                            });
                        });
                    });
                });
            });

            var success = function()
            {
                start();
            };
        });
    });
});
