import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("domainPrincipal9", function() {

    it("Domain Principal 9", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
            var user = null;
            var userName = "user_" + new Date().getTime();

            // start
            GitanaTest.authenticateFullOAuth().then(function() {

                // NOTE: this = platform

                // create a domain and a user
                this.createDomain().then(function() {

                    // NOTE: this = domain

                    // create a user and then change their password right away
                    this.createPrincipal({
                        "type": "USER",
                        "name": userName,
                        "password": "abc12345"
                    }).then(function() {

                        // NOTE: this = user
                        user = this;

                        // change the user identity's password
                        this.readIdentity().changePassword("def12345", "def12345").then(function() {
                            f1();
                        })
                    });
                });
            });

            var f1 = function()
            {
                // try logging in using old credentials
                GitanaTest.authenticate(user.getDomainQualifiedName(), "abc12345", null, function() {
                    f2();
                }).then(function() {
                    t.assert.ok(false, "Should not have arrived here, authentication should have failed");
                });
            };

            var f2 = function()
            {
                // try logging in using new credentials
                GitanaTest.authenticate(user.getDomainQualifiedName(), "def12345", null, function() {
                    t.assert.ok(false, "Should not have caught error with new password, authentication should have succeeded");
                }).then(function() {
                    success();
                });
            };

            var success = function()
            {
                t.assert.ok(true, "Password change succeeded");
                start();
            };
        });
    });
});
