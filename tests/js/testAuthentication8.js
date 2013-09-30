(function($) {

    //
    // Test case : Authentication 8
    //
    // Tests out automatic reacquisition of an access token using a refresh token.
    //
    module("authentication8");

    test("Authentication 8", function()
    {
        stop();
        expect(3);

        var gitana = new Gitana({
            "clientKey": GitanaTest.TEST_CLIENT_KEY
        });

        gitana.authenticate({ "username": "admin", "password": "admin" }).then(function() {

            // NOTE: this = platform

            ok(true, "Successfully authenticated");

            // list domains
            this.listDomains({
                "limit": -1
            }).then(function() {
                ok(true, "First list worked");
            });

            // now wipe out token and try again to ensure the refresh token gets used
            this.then(function() {

                this.getDriver().http.accessToken(null);

                // list domains again
                // this time the refresh token should be automatically used to re-acquire an access token
                this.listDomains({
                    "limit": -1
                }).then(function() {
                    ok(true, "Second list worked");
                });

                this.then(function() {
                    start();
                });

            });

        });
    });

}(jQuery) );