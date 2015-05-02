(function() {

    module("connect6");

    /**
     * Ensures that the Gitana driver can be used to connect to hosted Cloud CMS applications.
     * Tests against a live server instance.
     *
     * This test uses CORS and therefore will not work in IE8 or IE9.
     */

    // Test case : Gitana Connect #6
    _asyncTest("Gitana Connect #6", function()
    {
        // IGNORE THIS TEST
        expect(0);
        start();
        return;

        expect(3);

        var connectConfig = {};
        //connectConfig["host"] = "https://43e8a6e1-aec3-44a7-b475-91deea426749-hosted.cloudcms.net";
        //connectConfig["baseURL"] = "https://43e8a6e1-aec3-44a7-b475-91deea426749-hosted.cloudcms.net/proxy";
        connectConfig["baseURL"] = "http://t3.splashcds.com/oapi";
        //connectConfig["baseURL"] = "t3.splashcds.com/oapi";

        console.log("Running connect6 with config: " + JSON.stringify(connectConfig));

        var f1 = function()
        {
            Gitana.connect(connectConfig, function(err) {

                // NOTE: this = platform
                ok(!err, "Connected successfully as guest using connect()");

                Gitana.disconnect();

                // ensure the cookie is gone
                ok(!Gitana.readCookie("GITANA_TICKET", "Cookie was deleted"));

                f2();
            });
        };

        var f2 = function()
        {
            var cloud = new Gitana(connectConfig);
            cloud.authenticate().then(function() {

                ok(true, "Connected successfully as guest using authenticate()");

                start();
            });
        };

        f1();

    });

}());
