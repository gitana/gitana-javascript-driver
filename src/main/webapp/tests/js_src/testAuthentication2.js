(function($) {

    //
    // Test case : Authentication 2
    //
    // This tests out Gitana username/password authentication using the full consumer key/secret pair.
    // This authentication method rides on top of OAUTH for the consumer key/pair but then uses Gitana's ticket
    // mechanism to establish user authentication.
    //
    // This is useful when you need to have multi-user authentication based on username/password and you can afford
    // to send the credentials over the wire.  HTTPS is required.
    //
    module("authentication2");

    test("Authentication2", function()
    {
        stop();
        expect(1);

        var gitana = new Gitana({
            "consumerKey": GitanaTest.TEST_CONSUMER_KEY,
            "consumerSecret": GitanaTest.TEST_CONSUMER_SECRET
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