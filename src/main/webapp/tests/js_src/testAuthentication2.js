(function($) {

    //
    // Test case : Authentication 2
    //
    // This tests out Gitana OAuth2 username/password authentication using the full client key/secret pair and
    // a username and password.
    //
    // As with scenario #1, this method is not recommended for browser-side applications since the client secret
    // is being exposed.  In addition, we do not recommend hard coding the user's password as shown here.
    //
    // A password flow makes sense only if the password can be disposed of after the call.  The password should never
    // be written in the source code, stored as a variable or written to a cookie.
    //
    module("authentication2");

    test("Authentication2", function()
    {
        stop();
        expect(1);

        var gitana = new Gitana({
            "clientId": GitanaTest.TEST_CLIENT_ID,
            "clientSecret": GitanaTest.TEST_CLIENT_SECRET
        });

        gitana.authenticate({
            "username": "admin",
            "password": "admin"
        }).then(function() {

            // NOTE: this = platform

            ok(true, "Successfully authenticated");
            start();
        });
    });

}(jQuery) );