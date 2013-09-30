(function($) {

    //
    // Test case : Authentication 3
    //
    // Tests out the "open-driver" authentication flow which is a custom Gitana OAuth2 flow for clients that cannot
    // store the client secret.  This flow provides the 2-legged functionality of the username/password flow by
    // looking at the originating URL of the request and matching it against domains registered for the client.
    //
    // This pattern is useful for applications running in the browser (Javascript) which cannot hold a client secret.
    // In this test, we expose the password but this is just for test purposes.  Never expose the password in source
    // code.
    //
    module("authentication3");

    test("Authentication 3", function()
    {
        stop();
        expect(1);

        var gitana = new Gitana({
            "clientKey": GitanaTest.TEST_CLIENT_KEY
        });

        gitana.authenticate({ "username": "admin", "password": "admin" }).then(function() {

            // NOTE: this = platform

            this.listRepositories({
                "limit": -1
            }).then(function() {

                ok(true, "First authentication worked");

                start();

            });
        });
    });

}(jQuery) );