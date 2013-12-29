(function($) {

    // test manual setting of the ticket expiry
    // this example uses the max-age cookie attribute which will not work in IE8, IE9 or IE10
    // IE uses the "expires" attribute which doesn't appear to work the same way (in terms of read cookie)

    module("authentication15");

    // Test case : Authentication 15
    _asyncTest("Authentication 15", function()
    {
        expect(2);

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

            var platform = this;

            // get the GITANA_TICKET
            // ensure it exists
            var ticket = Gitana.readCookie("GITANA_TICKET");
            ok(ticket, "Ticket exists");

            // now wait for 10 seconds (for good measure)
            setTimeout(function() {

                // read the ticket again
                var ticket = Gitana.readCookie("GITANA_TICKET");
                ok(!ticket, "Ticket has expired");

                success();

            }, 10000);
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
