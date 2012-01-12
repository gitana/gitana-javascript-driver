(function($) {

    //
    // Test case : Authentication 3
    //
    // This tests out Gitana's "opendriver" authentication scheme which allows the JavaScript application to
    // authenticate without requiring any secrets being exchanged.
    //
    // This exists so that web browsers can authenticate as a consumer and a user without storing the consumer secret
    // access token secret in the web app (where it could viewed as part of the source).
    //
    // Usage of this mechanism requires that a tenant create a Consumer object inside of Gitana with the
    // "Allow OpenDriver Authentication" option turned on.  An authentication grant must exist that provides
    // the access token and secret to use with the consumer.
    //
    module("authentication3");

    test("Authentication3", function()
    {
        stop();
        expect(1);

        var gitana = new Gitana({
            "consumerKey": GitanaTest.TEST_CONSUMER_KEY
        });

        gitana.authenticate({
            "accessTokenKey": GitanaTest.TEST_ACCESS_TOKEN_KEY
        }).then(function() {

            // NOTE: this = platform

            ok(true, "Successfully authenticated");
            start();
        });
    });

}(jQuery) );