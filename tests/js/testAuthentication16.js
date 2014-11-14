(function($) {

    // tests cookie based authentication

    module("authentication16");

    // Test case : Authentication 16
    _asyncTest("Authentication 16", function()
    {
        expect(6);

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

            ok(!err, "No error on connect (pass 1)");

            // ensure the cookie exists
            var ticket = Gitana.readCookie("GITANA_TICKET");
            ok(ticket, "Cookie exists (pass 1)");

            // ensure we have an access token
            var accessToken = this.getDriver().http.accessToken();
            ok(accessToken, "Access token exists (pass 1)");

            // now disconnect
            Gitana.disconnect();

            // write the cookie back so that we can find it
            Gitana.writeCookie("GITANA_TICKET", ticket);

            // now authenticate using cookie
            Gitana.connect({
                "cookie": true
            }, function(err) {

                ok(!err, "No error on connect (pass 2)");

                // ensure the cookie exists
                var ticket = Gitana.readCookie("GITANA_TICKET");
                ok(ticket, "Cookie exists (pass 2)");

                // ensure we have an access token
                var accessToken = this.getDriver().http.accessToken();
                ok(accessToken, "Access token exists (pass 2)");

                success();
            });

        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
