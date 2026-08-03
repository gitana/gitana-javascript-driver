import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("authentication16", function() {

    it("Authentication 16", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(6);

        return guard(t, function(start) {
            /**
             * Log in as admin.
             * Request a 5 second ticket.
             */
            Gitana.reset();
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                "username": "admin",
                "password": "admin"
            }, function(err) {

                t.assert.ok(!err, "No error on connect (pass 1)");

                // ensure the cookie exists
                var ticket = Gitana.readCookie("GITANA_TICKET");
                t.assert.ok(ticket, "Cookie exists (pass 1)");

                // ensure we have an access token
                var accessToken = this.getDriver().http.accessToken();
                t.assert.ok(accessToken, "Access token exists (pass 1)");

                // now disconnect
                Gitana.disconnect();

                // write the cookie back so that we can find it
                Gitana.writeCookie("GITANA_TICKET", ticket);

                // now authenticate using cookie
                Gitana.connect({
                    "cookie": true
                }, function(err) {

                    t.assert.ok(!err, "No error on connect (pass 2)");

                    // ensure the cookie exists
                    var ticket = Gitana.readCookie("GITANA_TICKET");
                    t.assert.ok(ticket, "Cookie exists (pass 2)");

                    // ensure we have an access token
                    var accessToken = this.getDriver().http.accessToken();
                    t.assert.ok(accessToken, "Access token exists (pass 2)");

                    success();
                });

            });

            var success = function()
            {
                start();
            };
        });
    });
});
