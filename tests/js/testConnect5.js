(function() {

    module("connect5");

    /**
     * Ensures that the Gitana driver can be used to connect to hosted Cloud CMS applications.
     *
     * This test uses CORS and therefore will not work in IE8 or IE9.
     */

    // Test case : Gitana Connect #5
    _asyncTest("Gitana Connect #5", function()
    {
        expect(3);

        Gitana.HTTP_X_CLOUDCMS_ORIGIN_HEADER = false;

        var host = "https://43e8a6e1-aec3-44a7-b475-91deea426749-hosted.cloudcms.net";
        var baseURL = host + "/proxy";

        // connects using CORS to a hosted cloud cms application proxy (as the guest/guest user)
        var f1 = function(callback)
        {
            Gitana.connect({
                "baseURL": baseURL,
                "username": "guest",
                "password": "guest"
            }, function() {

                // NOTE: this = platform
                ok(this, "Found platform f1");

                callback();
            });
        };

        // connects using CORS to a hosted cloud cms application (as the guest/guest user)
        var f2 = function(callback)
        {
            Gitana.connect({
                "host": host,
                "username": "guest",
                "password": "guest"
            }, function() {

                // NOTE: this = platform
                ok(this, "Found platform f2");

                callback();
            });
        };

        // connects using CORS to a hosted cloud cms application (as the default guest/guest user)
        var f3 = function(callback)
        {
            Gitana.connect({
                "host": host
            }, function() {

                // NOTE: this = platform
                ok(this, "Found platform f3");

                callback();
            });
        };

        f1(function() {
            f2(function() {
                f3(function() {

                    Gitana.HTTP_X_CLOUDCMS_ORIGIN_HEADER = true;
                    start();
                });
            });
        });

    });

}());
