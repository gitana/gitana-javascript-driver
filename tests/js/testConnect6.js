(function() {

    module("connect6");

    /**
     * Ensures that the Gitana driver can be used to connect to hosted Cloud CMS applications.
     * Tests against a live server instance.
     */

    // Test case : Gitana Connect #6
    test("Gitana Connect #6", function()
    {
        stop();

        expect(1);

        Gitana.connect({
            "host": "https://24e5fe6f-c30c-4a37-83a8-e67739c9a52d-hosted.cloudcms.net"
        }, function(err) {

            // NOTE: this = platform
            ok(!err, "Connected successfully as guest");

            start();
        });

    });

}());
