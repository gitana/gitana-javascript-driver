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

            console.log("Access Token 1: " + accessToken1);

            // manually refresh
            // this gets a new access token using the current refresh token
            this.getDriver().refreshAuthentication(function(err) {

                if (!err)
                {
                    ok("Refresh Authentication #1 completed without error");
                }

                var accessToken2 = platform.getDriver().http.accessToken();
                var refreshToken2 = platform.getDriver().http.refreshToken();

                console.log("Access Token 2: " + accessToken2);

                // refresh token should be the same
                equal(refreshToken2, refreshToken1, "Refresh tokens matched (pass 1)");
                notEqual(accessToken2, accessToken1, "Access tokens different (pass 1)");

                // wait at least 15 seconds before refreshing again
                // Gitana Server has a 15 second refresh period during which it will hand back the same access token
                // so as to prevent race conditions with multiple processes refreshing at the same time
                setTimeout(function() {

                    // manually refresh
                    // this gets a new access token using the current refresh token
                    platform.getDriver().refreshAuthentication(function(err) {

                        if (!err)
                        {
                            ok("Refresh Authentication #2 completed without error");
                        }

                        var accessToken3 = platform.getDriver().http.accessToken();
                        var refreshToken3 = platform.getDriver().http.refreshToken();

                        console.log("Access Token 3: " + accessToken3);

                        // refresh token should be the same
                        equal(refreshToken3, refreshToken2, "Refresh tokens matched (pass 2)");
                        notEqual(accessToken3, accessToken2, "Access tokens different (pass 2)");

                        success();
                    });

                }, 20000);

            });
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
