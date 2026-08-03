import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("meter1", function() {

    it("Meter 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
            var user = null;
            var clientConfig = null
            var tenant = null;

            // authenticate as admin (on admin tenant)
            GitanaTest.authenticateFullOAuth().then(function() {

                // NOTE: this = platform

                // create a user
                this.readPrimaryDomain().createUser({
                    "name": "test-" + new Date().getTime(),
                    "password": "pw123456"
                }).then(function() {
                    user = this;
                });


                this.then(function() {

                    this.readRegistrar("default").then(function() {

                        // NOTE: this = registar

                        // create a tenant for this user
                        this.createTenant(user, "unlimited").then(function() {

                            // NOTE: this = tenant
                            tenant = this;

                            // read the default client
                            this.readDefaultAllocatedClientObject(function(theClientConfig) {
                                clientConfig = theClientConfig;
                            });

                        });

                        // read the meters for this tenant
                        this.then(function() {

                            // NOTE: this = registrar

                            // there should be two created meters ("storage" and "transferOut")
                            this.queryMeters({
                                "tenantId": tenant.getId()
                            }).count(function(count) {
                                t.assert.equal(count, 2, "Found two meters");
                            });

                            // find "storage meter"
                            this.queryMeters({
                                "tenantId": tenant.getId(),
                                "meterType": "STORAGE"
                            }).keepOne().then(function() {
                                t.assert.ok(true, "Found storage meter");
                            });

                            this.then(function() {

                                // find "transferOut" meter
                                this.queryMeters({
                                    "tenantId": tenant.getId(),
                                    "meterType": "TRANSFER_OUT"
                                }).keepOne().then(function() {
                                    t.assert.ok(true, "Found transferOut meter");

                                    start();
                                });
                            });

                        });

                    });

                });

            });

            var success = function() {
                start();
            };
        });
    });
});
