import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("authentication9", function() {

    it("Authentication 9", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
            var ticket = null;

            var gitana = new Gitana({
                "clientKey": GitanaTest.TEST_CLIENT_KEY
            });

            var f1 = function()
            {
                gitana.authenticate({ "username": "admin", "password": "admin" }, function(err) {
                    console.warn(err);
                    start();
                    return;
                }).then(function() {

                    // NOTE: this = platform

                    t.assert.ok(true, "Successfully authenticated");

                    // store the ticket
                    ticket = this.getDriver().getAuthInfo().getTicket();
                    t.assert.ok(ticket, "Found a ticket");

                    // log out
                    this.logout().then(function() {
                        f2();
                    });

                });
            };

            var f2 = function()
            {
                gitana.authenticate({ "ticket": ticket }, function(err) {
                    f3(false);
                }).then(function() {
                    f3(true);
                });
            };

            var f3 = function(result)
            {
                t.assert.ok(result, "Successfully authenticated");

                start();
            };

            f1();
        });
    });
});
