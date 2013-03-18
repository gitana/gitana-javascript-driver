(function($) {

    //
    // Test case : Authentication 4
    //
    // Tests out the "open-driver" authentication flow which is a custom Gitana OAuth2 flow for clients that cannot
    // store the client secret.  This flow provides the 2-legged functionality of the username/password flow by
    // looking at the originating URL of the request and matching it against domains registered for the client.
    //
    // Here we also assume that the user password cannot be trusted.  We can do this only if we pregenerate
    // an authentication grant within Gitana and supply the key here.  Authentication grants are wired to a single
    // client and user.  They cannot be shared across clients.
    //
    // Furthermore, if an authentication grant becomes overused, they can be shut down without compromising the
    // client or its applications.
    //
    //
    module("authentication4");

    test("Authentication 4", function()
    {
        stop();
        expect(1);

        var gitana = new Gitana({
            "clientKey": GitanaTest.TEST_CLIENT_KEY
        });

        gitana.authenticate({
            "username": GitanaTest.TEST_USER_CREDENTIALS_KEY
        }).then(function() {

            // NOTE: this = platform

            ok(true, "Successfully authenticated");
            start();
        });
    });

}(jQuery) );