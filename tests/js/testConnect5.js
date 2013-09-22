(function() {

    module("connect5");

    /**
     * Ensures that the Gitana driver can be used to connect to hosted Cloud CMS applications.
     */

    // Test case : Gitana Connect #5
    test("Gitana Connect #5", function()
    {
        stop();

        expect(3);

        // connects using CORS to a hosted cloud cms application proxy (as the guest/guest user)
        var f1 = function(callback)
        {
            Gitana.connect({
                "baseURL": "http://demo.cloudcms.net/proxy",
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
                "host": "http://demo.cloudcms.net",
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
                "host": "http://demo.cloudcms.net"
            }, function() {

                // NOTE: this = platform
                ok(this, "Found platform f3");

                callback();
            });
        };

        f1(function() {
            f2(function() {
                f3(function() {
                    start();
                });
            });
        });

    });

}());
