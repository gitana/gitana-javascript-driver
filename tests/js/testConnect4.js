(function() {

    module("connect4");

    /**
     * Ensures that the Connect() method allows for guest access when username and password are not specified.
     */

    // Test case : Gitana Connect #4
    _asyncTest("Gitana Connect #4", function()
    {
        expect(1);

        Gitana.connect({
            "clientKey": GitanaTest.TEST_CLIENT_KEY,
            "clientSecret": GitanaTest.TEST_CLIENT_SECRET
        }, function() {

            // NOTE: this = platform
            ok(this, "Connected successfully");

            start();
        });

    });

}());
