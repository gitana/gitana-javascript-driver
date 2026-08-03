import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("authInfo1", function() {

    it("Auth Info 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(5);

        return guard(t, function(start) {
            // start
            var gitana = GitanaTest.authenticate("admin", "admin");
            gitana.then(function() {

                // NOTE: this = platform

                var authInfo = this.getDriver().getAuthInfo();

                // principal
                t.assert.equal("default", authInfo.getPrincipalDomainId(), "Validated principal domain id value");
                t.assert.equal("admin", authInfo.getPrincipalName(), "Validated principal name value");
                t.assert.ok(authInfo.getPrincipalId(), "Validated principal id exists");

                // client
                t.assert.equal("eb9bcf0b-050d-4931-a11b-2231be0fd168", authInfo.getClientId(), "Validate client key value");

                // tenant
                t.assert.ok(authInfo.getTenantId(), "Validated tenant id exists");
                //t.assert.ok(authInfo.getTenantTitle(), "Validated tenant title exists");
                //t.assert.ok(authInfo.getTenantDescription(), "Validated tenant description exists");

                this.then(function() {
                    success();
                });

                var success = function()
                {
                    start();
                };
            });
        });
    });
});
