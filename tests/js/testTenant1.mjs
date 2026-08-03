import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("tenant1", function() {

    it("Tenant 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(8);

        return guard(t, function(start) {
            var test = this;

            var platform = GitanaTest.authenticateFullOAuth();
            platform.then(function() {

                // NOTE: this = platform

                // create a user
                var user = null;
                var username = "user-" + new Date().getTime();
                this.readPrimaryDomain().createUser({
                    "name": username,
                    "password": "xyz12345"
                }).then(function() {
                    user = this;
                });

                this.readRegistrar("default").then(function() {

                    // NOTE: this = registrar

                    // original count of tenants
                    var originalCount = -1;
                    this.listTenants({
                        "limit": -1
                    }).count(function(count) {
                        originalCount = count;
                    });

                    // create a tenant for our user
                    var tenant = null;
                    this.createTenant(user, "unlimited").then(function() {
                        tenant = this;
                    });

                    // list tenants and confirm size change
                    this.listTenants({
                        "limit": -1
                    }).count(function(count) {
                        t.assert.equal(count, originalCount + 1, "Tenant size increased by 1");
                    });

                    // query tenants
                    this.queryTenants({
                        "planKey": "unlimited"
                    }, {
                        "limit": -1
                    }).count(function(count) {
                        t.assert.ok(count > 0, "Found at least one starter");
                    });

                    // find tenant for principal
                    this.lookupTenantForPrincipal(user).then(function() {
                        t.assert.equal(tenant.getId(), this.getId(), "Found tenant by principal");
                    });

                    // verify that we can lookup the principal and plan for a tenant
                    this.then(function() {
                        this.readTenant(tenant.getId()).then(function() {

                            // look up plan
                            this.readTenantPlan().then(function() {
                                t.assert.equal(this.getPlanKey(), "unlimited", "Plan keys matched");
                            });

                            // look up principal
                            this.readTenantPrincipal().then(function() {
                                t.assert.equal(this.getId(), user.getId(), "Principal id matched");;
                                t.assert.equal(this.getDomainId(), user.getDomainId(), "Principal id matched");
                                t.assert.equal(this.getName(), user.getName(), "Principal id matched");
                            });
                        });
                    });

                    // delete the tenant
                    this.then(function() {
                        this.readTenant(tenant.getId()).del();
                    });

                    // count tenants
                    this.listTenants({
                        "limit": -1
                    }).count(function(count) {
                        t.assert.equal(count, originalCount, "Tenant successfully deleted");
                    });

                    this.then(function() {
                        success();
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
