(function($) {

    // test manual setting of the ticket expiry

    module("authentication15");

    // Test case : Authentication 15
    _asyncTest("Authentication 15", function()
    {
        expect(2);

        /**
         * Log in as admin.
         * Request a 5 second ticket.
         */
        Gitana.connect({
            "clientKey": GitanaTest.TEST_CLIENT_KEY,
            "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
            "username": "admin",
            "password": "admin",
            "ticketMaxAge": 5
        }, function(err) {

            // NOTE: this = platform

            var platform = this;

            // get the GITANA_TICKET
            // ensure it exists
            var ticket = Gitana.readCookie("GITANA_TICKET");
            ok(ticket, "Ticket exists");

            // now wait for 6 seconds (5 seconds + 1 for good measure)
            setTimeout(function() {

                // read the ticket again
                var ticket = Gitana.readCookie("GITANA_TICKET");
                ok(!ticket, "Ticket has expired");

                success();

            }, 6000);
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
