import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("authentication15", function() {

    it("Authentication 15", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(2);

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
                "password": "admin",
                "ticketMaxAge": 5
            }, function(err) {

                // NOTE: this = platform

                // get the GITANA_TICKET
                // ensure it exists
                var ticket = Gitana.readCookie("GITANA_TICKET");
                t.assert.ok(ticket, "Ticket exists");

                // now wait for 10 seconds (for good measure)
                setTimeout(function() {

                    // read the ticket again
                    var ticket = Gitana.readCookie("GITANA_TICKET");
                    t.assert.ok(!ticket, "Ticket has expired");

                    success();

                }, 10000);
            });

            var success = function()
            {
                start();
            };
        });
    });
});
