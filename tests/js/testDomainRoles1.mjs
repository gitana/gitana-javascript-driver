import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("domainRoles1", function() {

    it("Domain Roles #1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(6);

        return guard(t, function(start) {
            GitanaTest.authenticateFullOAuth().then(function() {

                // NOTE: this = platform

                // create a domain
                this.createDomain().then(function() {

                    // direct roles count == 0
                    this.listRoles(false).count(function(count) {
                        t.assert.ok(count == 0, "Found zero direct roles");
                    });

                    // indirect roles count > 0
                    var indirectRoleCount = -1;
                    this.listRoles(true).count(function(count) {
                        t.assert.ok(count > 0, "Found indirect roles");
                        indirectRoleCount = count;
                    });

                    this.then(function() {

                        // create a role
                        this.createRole("abc");

                        // now list direct roles
                        this.listRoles(false).count(function(count) {
                            t.assert.ok(count == 1, "Found one direct role");
                        });

                        // confirm indirect role count
                        this.listRoles(true).count(function(count) {
                            t.assert.ok(count == indirectRoleCount + 1, "Indirect role count incremented by one");
                        });

                    });

                    this.then(function() {

                        // delete the role
                        this.readRole("abc").then(function() {
                            this.del();
                        });

                        this.then(function() {

                            // list direct roles
                            this.listRoles(false).count(function(count) {
                                t.assert.ok(count == 0, "Direct role deleted");
                            });

                            // list indirectRoles
                            this.listRoles(true).count(function(count) {
                                t.assert.ok(count == indirectRoleCount, "Indirect role count decremented back to original value");
                            });

                            this.then(function() {
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
