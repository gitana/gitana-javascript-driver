(function($) {

    // tests http timeouts

    module("http1");

    // Test case : Http 1
    _asyncTest("Http 1", function()
    {
        expect(9);

        // base case - ensure things work
        var f1 = function()
        {
            Gitana.reset();
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                "username": "admin",
                "password": "admin"
            }, function(err) {
                ok(!err, "Test1 - Logged in successfully with 2 minute timeout");
                f2();
            });
        };

        // tests authenticate() method
        var f2 = function()
        {
            Gitana.reset();

            // set timeout to 1 millisecond
            // this should fail
            Gitana.HTTP_TIMEOUT = 1;

            var gitana = new Gitana({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET
            });

            gitana.authenticate({
                "username": GitanaTest.TEST_USER_CREDENTIALS_KEY,
                "password": GitanaTest.TEST_USER_CREDENTIALS_SECRET
            }, function(err) {

                ok(err, "Test2 - Caught expected error");
                equal(err.errorType, "timeout", "Test2 - Error is a timeout error");

                f3();

            }).then(function() {

                ok(false, "Test2 - should never get here");
            });
        };

        // tests connect() method
        var f3 = function()
        {
            Gitana.reset();

            // set timeout to 1 millisecond
            // this should fail
            Gitana.HTTP_TIMEOUT = 1;

            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                "username": "admin",
                "password": "admin"
            }, function(err) {
                ok(err, "Test3 - Caught expected error");
                equal(err.errorType, "timeout", "Test3 - Error is a timeout error");

                f4();
            });
        };

        // tests trap() method
        var f4 = function()
        {
            Gitana.reset();

            // set timeout to 2 minutes
            // this is the default
            Gitana.HTTP_TIMEOUT = 120000;

            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                "username": "admin",
                "password": "admin"
            }, function(err) {
                ok(!err, "Logged in successfully with 2 minute timeout");

                // now set timeout to 1 millisecond
                Gitana.HTTP_TIMEOUT = 1;

                // try to do anything
                // verify trap handler works
                this.trap(function(err) {
                    ok(true, "Test4 - Heard trap fire");

                    ok(err, "Test4 - Caught expected error");
                    equal(err.errorType, "timeout", "Test4 - Error is a timeout error");

                    success();
                });

                this.listRepositories();
            });
        };

        f1();

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
