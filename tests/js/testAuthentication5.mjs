import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("authentication5", function() {

    it("Authentication 5", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
            var trap = function(http)
            {
                t.assert.ok(true, "Trap caught 403 - no authentication");
                start();
            };

            // authenticate, do something, log out and then verify we're logged out
            var gitana = new Gitana({
                "clientKey": GitanaTest.TEST_CLIENT_KEY
            });

            gitana.authenticate({ "username": "admin", "password": "admin" }, function(err) {
                console.warn(err);
                start();
                return;
            }).then(function() {

                // NOTE: this = platform

                this.createRepository();

                this.listRepositories({
                    "limit": -1
                }).count(function(count) {

                    t.assert.ok(count > 0, "Count was greater than zero");
                });

            }).trap(trap).logout().then(function() {

                // cookie should be gone
                t.assert.ok(!Gitana.readCookie("GITANA_TICKET", "Cookie was deleted"));

                this.listRepositories({
                    "limit": -1
                }).then(function() {
                    t.assert.ok(false, "Should not have made it this far");
                });
            });
        });
    });
});
