import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("tenant2", function() {

    it("Tenant 2", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
            var platform = GitanaTest.authenticateFullOAuth();
            platform.then(function() {

                // NOTE: this = platform

                // create a user
                var user = null;
                this.readPrimaryDomain().createUser({
                    "name": "user1-" + new Date().getTime(),
                    "password": "pw123456"
                }).then(function() {
                    user = this;
                });

                this.readRegistrar("default").then(function() {

                    // NOTE: this = registrar

                    // create a tenant for the user
                    var tenant = null;
                    this.createTenant(user, "unlimited").then(function() {
                        tenant = this;
                    });

                    // find the tenant user on the tenant platform by using the identity
                    this.then(function() {

                        // pivot on the identity
                        this.subchain(user).readIdentity().then(function() {

                            // NOTE: this = identity

                            // check to make sure that the identity now has 2 users (the original domain and the tenant platform's domain
                            this.findPolicyUsers().count(function(count) {
                                t.assert.ok(count == 2, "Found 2 users for identity");
                            });

                            // check to make sure that this identity participates the new tenant (1)
                            this.findPolicyTenants().count(function(count) {
                                t.assert.ok(count == 1, "Found 1 tenant for identity");
                            });

                            // check to make sure we can find the copy of the user on the tenant platform's default domain
                            this.findPolicyUserForTenant(tenant.getId()).then(function() {
                                t.assert.ok(true, "Found tenant user on tenant platform domain");
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
