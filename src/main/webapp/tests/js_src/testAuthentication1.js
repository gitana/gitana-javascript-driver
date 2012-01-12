(function($) {

    //
    // Test case : Authentication 1
    //
    // This tests out OAUTH authentication using the test consumer and access key pair.
    // This is a base case where we exposed the consumer and access token information within the application.
    //
    // This is a good practice within compiled or server-side environments like Appcelerator Titanium or node.js
    //
    // However, it is a very bad practice in a web environment (where source code is exposed).
    //
    module("authentication1");

    test("Authentication1", function()
    {
        stop();
        expect(1);

        var gitana = new Gitana({
            "consumerKey": GitanaTest.TEST_CONSUMER_KEY,
            "consumerSecret": GitanaTest.TEST_CONSUMER_SECRET
        });

        gitana.authenticate({
            "accessTokenKey": GitanaTest.TEST_ACCESS_TOKEN_KEY,
            "accessTokenSecret": GitanaTest.TEST_ACCESS_TOKEN_SECRET
        }).then(function() {

            // NOTE: this = platform

            ok(true, "Successfully authenticated");
            start();

        });
    });

}(jQuery) );