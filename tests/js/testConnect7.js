(function($) {

    // tests cookie based authentication using connect method to Cloud CMS application server

    module("connect7");

    // Test case : Connect 7
    _asyncTest("Connect 7", function()
    {
        // in order for this test to work, we require cross-domain cookie access
        // the cookie we get back from server is on a different domain than we're testing from
        expect(0);
        start();

        /*
        expect(6);

        var connectConfig = {};
        connectConfig["host"] = "https://43e8a6e1-aec3-44a7-b475-91deea426749-hosted.cloudcms.net";

        Gitana.connect(connectConfig, function(err) {

            ok(!err, "No error on connect (pass 1)");

            // ensure the cookie exists
            var ticket = Gitana.readCookie("GITANA_TICKET");
            ok(ticket && "null" != ticket, "Cookie exists (pass 1)");

            // ensure we have an access token
            var accessToken = this.getDriver().http.accessToken;
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
                // NOTE: same as above, we can't do this
                var ticket = Gitana.readCookie("GITANA_TICKET");
                ok(ticket && "null" != ticket, "Cookie exists (pass 2)");

                // ensure we have an access token
                var accessToken = this.getDriver().http.accessToken;
                ok(accessToken, "Access token exists (pass 2)");

                success();
            });

        });

        var success = function()
        {
            start();
        };
        */

    });

}(jQuery) );
