(function() {

    module("connect2");

    // Test case : Gitana Connect #2
    // Ensure that if an app isn't found, an appropriate error message is passed through
    test("Gitana Connect #1", function()
    {
        stop();

        expect(2);

        var appKey = "app-" + new Date().getTime();

        var f1 = function()
        {
            // use the connect() method to take advantage of Gitana's automatic connection loading
            // this will sign on anew and pre-load information for the given stack
            // if a "key" is provided, the driver is cached
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_ID,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                "username": "admin",
                "password": "admin",
                "application": appKey
            }).app(function(err) {

                ok(err, "Received an error due to missing app allocation to stack");

                f2();

            });
        };

        var f2 = function()
        {
            // try again using a function callback, should produce the same result
            var count2 = Gitana.requestCount;
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_ID,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                "username": "admin",
                "password": "admin",
                "application": appKey
            }, function(err) {

                ok(err, "Received an error due to missing app allocation to stack");

                success();
            });

        };

        var success = function()
        {
            start();
        };

        // create stack + some data stores and things
        GitanaTest.authenticateFullOAuth().then(function() {

            // this == platform

            var stack = null;
            this.createStack().then(function() {
                stack = this;
            });
            this.then(function() {

                // this == platform

                this.createApplication({"key": appKey}).then(function() {
                    // DO NOT ASSIGN TO STACK
                });

            }).then(function() {
                f1();
            });
        });

    });

}());
