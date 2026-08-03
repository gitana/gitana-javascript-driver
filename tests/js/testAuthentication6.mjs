import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("authentication6", function() {

    it("Authentication 6", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(2);

        return guard(t, function(start) {
            var authFailedHandler = function(http)
            {
                // NOTE: this = platform

                t.assert.ok(true, "Trap caught bad credentials - good");

                // now try to re-authenticate
                this.authenticate({"username":"admin", "password":"admin"}, function(err) {
                    console.warn(err);
                    start();
                    return;
                }).then(function() {

                    // NOTE: this = platform

                    t.assert.ok(true, "Successfully logged in");

                    start();
                });

            };

            // try to authenticate with invalid credentials and verify we hit the auth failure handler
            // authenticate, do something, log out and then verify we're logged out
            var gitana = new Gitana({
                "clientKey": GitanaTest.TEST_CLIENT_KEY
            });

            // this first authentication will work just fine
            gitana.authenticate({ "username": "admin", "password": "admin" }, function(err) {
                console.warn(err);
                start();
                return;
            }).then(function() {

                // this one will fail
                gitana.authenticate({"username":"admin", "password":"admin2"}, authFailedHandler).then(function() {
                    t.assert.ok(false, "Should not have made it this far");
                });
            });
        });
    });
});
