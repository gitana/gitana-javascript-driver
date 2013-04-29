(function($) {

    // authenticates with a custom client
    // sets the access token validation period to 1 second and then verifies that refresh tokens
    // work as intended
    //

    module("authentication12");

    // Test case : Authentication 12
    test("Authentication 12", function()
    {
        stop();

        expect(15);

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

                                ok("F0: Read default client");

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
                    "accessTokenValiditySeconds": 10,
                    "refreshTokenValiditySeconds": 1000
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

                // check the expiration of the access token (should be 10 seconds out or less)
                var expiresIn = this.getDriver().http.expiresIn();
                ok(expiresIn <= 10, "F2: Expires in 10 seconds");

                var platform = this;

                // wait five seconds
                window.setTimeout(function() {

                    // now refresh the access token
                    platform.getDriver().refreshAuthentication(function(err) {

                        // wait five more seconds
                        window.setTimeout(function() {

                            // continue
                            f3.call(platform, client, ticket, accessToken, refreshToken, grantTime);

                        }, 5000);

                    });

                }, 5000);

            });
        };

        /**
         * Ten seconds have now passed.  At around the 5 second mark, we refreshed the access token so we should be able
         * to keep using the access token for at least one more call.
         *
         * @param client
         * @param ticket
         * @param accessToken
         * @param refreshToken
         * @parma grantTime
         */
        var f3 = function(client, ticket, accessToken, refreshToken, grantTime)
        {
            // try to do something with the platform (here we list registrars)
            this.listRegistrars().then(function() {

                Chain(this.getPlatform()).then(function() {

                    // this = platform

                    var newTicket = this.getDriver().getAuthInfo().getTicket();
                    ok(newTicket, "F3: Acquired a new ticket");
                    ok(newTicket == ticket, "F3: Ticket is the same!");

                    var newAccessToken = this.getDriver().http.accessToken();
                    ok(newAccessToken != accessToken, "F3: Access token changed!");

                    var newRefreshToken = this.getDriver().http.refreshToken();
                    ok(newRefreshToken == refreshToken, "F3: Refresh token is the same");

                    // check the expiration of the access token (should be 10 seconds out or less)
                    var expiresIn = this.getDriver().http.expiresIn();
                    ok(expiresIn <= 10, "F3: Expires in 10 seconds");

                    // check the grant time changed
                    var newGrantTime = this.getDriver().http.grantTime();
                    ok(newGrantTime != grantTime, "F3: Grant time changed");

                    success();
                });
            });
        };

        var success = function()
        {
            start();
        };

        f0();

    });

}(jQuery) );
