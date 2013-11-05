(function($) {

    // test manual refreshing of tokens

    module("authentication14");

    // Test case : Authentication 14
    _asyncTest("Authentication 14", function()
    {
        expect(6);

        /**
         * Log in as admin.
         */
        Gitana.connect({
            "clientKey": GitanaTest.TEST_CLIENT_KEY,
            "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
            "username": "admin",
            "password": "admin"
        }, function(err) {

            // NOTE: this = platform

            var platform = this;

            // get the current access and refresh tokens
            var accessToken1 = platform.getDriver().http.accessToken();
            var refreshToken1 = platform.getDriver().http.refreshToken();

            // manually refresh
            // this gets a new access token using the current refresh token
            this.getDriver().refreshAuthentication(function(err) {

                if (!err)
                {
                    ok("Refresh Authentication #1 completed without error");
                }

                var accessToken2 = platform.getDriver().http.accessToken();
                var refreshToken2 = platform.getDriver().http.refreshToken();

                // refresh token should be the same
                equal(refreshToken2, refreshToken1, "Refresh tokens matched (pass 1)");
                notEqual(accessToken2, accessToken1, "Access tokens different (pass 1)");

                // manually refresh
                // this gets a new access token using the current refresh token
                platform.getDriver().refreshAuthentication(function(err) {

                    if (!err)
                    {
                        ok("Refresh Authentication #2 completed without error");
                    }

                    var accessToken3 = platform.getDriver().http.accessToken();
                    var refreshToken3 = platform.getDriver().http.refreshToken();

                    // refresh token should be the same
                    equal(refreshToken3, refreshToken2, "Refresh tokens matched (pass 2)");
                    notEqual(accessToken3, accessToken2, "Access tokens different (pass 2)");

                    success();
                });

            });
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
