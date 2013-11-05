(function($) {

    //
    // Test case : Authentication 1
    //
    // This tests out OAUTH authentication using the test client and test user credentials.
    // This is a base case where we expose the client and user credentials within the application.
    //
    // This is a good practice within compiled or server-side environments like Node JS or Appcelerator Titanium.
    //
    // However, it is a bad practice in a web environment (since the credential secrets are exposed).
    //
    module("authentication1");

    _asyncTest("Authentication 1", function()
    {
        expect(1);

        var gitana = new Gitana({
            "clientKey": GitanaTest.TEST_CLIENT_KEY,
            "clientSecret": GitanaTest.TEST_CLIENT_SECRET
        });

        gitana.authenticate({
            "username": GitanaTest.TEST_USER_CREDENTIALS_KEY,
            "password": GitanaTest.TEST_USER_CREDENTIALS_SECRET
        }).then(function() {

            // NOTE: this = platform

            ok(true, "Successfully authenticated");
            start();

        });
    });

}(jQuery) );