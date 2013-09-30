(function($) {

    // tests refresh tokens
    // creates a new client with access token validity of 1 second
    // continues to use it at 3 second increments
    // verifies that auto-refresh occurs


    module("authentication13");

    // Test case : Authentication 13
    test("Authentication 13", function()
    {
        stop();

        expect(18);

        var username = "user-" + new Date().getTime();

        /**
         * Log in as admin and create a new tenant.
         */
        var f0 = function()
        {
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                "username": "admin",
                "password": "admin"
            }, function(err) {

                // NOTE: this = platform

                ok(!err, "F0: First connect successful");

                // create a user
                var user = null;
                this.readPrimaryDomain().createUser({
                    "name": username,
                    "password": "pw"
                }).then(function() {
                    user = this;
                });

                this.then(function() {

                    // create a tenant
                    this.readRegistrar("default").then(function() {
                        this.createTenant(user, "unlimited").then(function() {

                            // NOTE: this = tenant

                            // read the default client
                            this.readDefaultAllocatedClientObject(function(theClientConfig) {

                                ok("Pass0: Read default client");

                                f1(theClientConfig.getKey(), theClientConfig.getSecret());
                            });

                        });
                    });

                });
            });
        };

        /**
         * Log into the new tenant and create a new Client object with limitations.
         *
         * @param clientKey
         * @param clientSecret
         */
        var f1 = function(clientKey, clientSecret)
        {
            Gitana.connect({
                "clientKey": clientKey,
                "clientSecret": clientSecret,
                "username": username,
                "password": "pw"
            }, function(err) {

                // NOTE: this = platform

                ok(!err, "F1: connect successful");

                // create a client
                this.createClient({
                    "accessTokenValiditySeconds": 1, // access token lives for 1 second
                    "refreshTokenValiditySeconds": 1000 // refresh token lives for a long time
                }).then(function() {

                    ok(this, "F1: Successfully created client");

                    f2(this);
                });
            });
        };

        /**
         * Log in using client and get a ticket.
         *
         * @param client
         */
        var f2 = function(client)
        {
            Gitana.connect({
                "clientKey": client["key"],
                "clientSecret": client["secret"],
                "username": username,
                "password": "pw"
            }, function(err) {

                // NOTE: this = platform

                ok(!err, "F2: Connected using new client");

                var ticket = this.getDriver().getAuthInfo().getTicket();
                ok(ticket, "F2: Acquired ticket for new client");

                var accessToken = this.getDriver().http.accessToken();
                ok(accessToken, "F2: Acquired access token");

                var refreshToken = this.getDriver().http.refreshToken();
                ok(refreshToken, "F2: Acquired refresh token");

                var grantTime = this.getDriver().http.grantTime();

                var expiresIn = this.getDriver().http.expiresIn();

                var platform = this;

                // wait 3 seconds
                // this forces the access token to be refreshed
                // it will have the same value?
                window.setTimeout(function() {

                    // list registrars
                    Chain(platform).listRegistrars({
                        "limit": -1
                    }).then(function() {

                        var newTicket1 = this.getDriver().getAuthInfo().getTicket();
                        ok(newTicket1, "Pass1: Acquired a new ticket");
                        ok(newTicket1 == ticket, "Pass1: Ticket is the same!");

                        var newAccessToken1 = this.getDriver().http.accessToken();
                        ok(newAccessToken1 != accessToken, "Pass1: Access token changed!");

                        var newRefreshToken1 = this.getDriver().http.refreshToken();
                        ok(newRefreshToken1 == refreshToken, "Pass1: Refresh token is the same");

                        // check the grant time changed
                        var newGrantTime1 = this.getDriver().http.grantTime();
                        ok(newGrantTime1 != grantTime, "Pass1: Grant time changed");

                        // check the expires in (stays the same)
                        var newExpiresIn = this.getDriver().http.expiresIn();

                        // wait 3 seconds
                        window.setTimeout(function() {

                            // list registrars
                            Chain(platform).listRegistrars({
                                "limit": -1
                            }).then(function() {

                                var newTicket2 = this.getDriver().getAuthInfo().getTicket();
                                ok(newTicket2, "Pass2: Acquired a new ticket");
                                ok(newTicket2 == newTicket1, "Pass2: Ticket is the same!");

                                var newAccessToken2 = this.getDriver().http.accessToken();
                                ok(newAccessToken2 != newAccessToken1, "Pass2: Access token changed!");

                                var newRefreshToken2 = this.getDriver().http.refreshToken();
                                ok(newRefreshToken2 == newRefreshToken1, "Pass2: Refresh token is the same");

                                // check the grant time changed
                                var newGrantTime2 = this.getDriver().http.grantTime();
                                ok(newGrantTime2 != newGrantTime1, "Pass2: Grant time changed");

                                success();
                            });

                        }, 3000);

                    });

                }, 3000);

            });
        };

        var success = function()
        {
            start();
        };

        f0();

    });

}(jQuery) );
