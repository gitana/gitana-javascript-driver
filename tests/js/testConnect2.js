(function() {

    module("connect2");

    // Test case : Gitana Connect #2
    // Ensure that if an app isn't found, an appropriate error message is passed through
    _asyncTest("Gitana Connect #2", function()
    {
        expect(2);

        var appKey = "app-" + new Date().getTime();

        var f1 = function()
        {
            // use the connect() method to take advantage of Gitana's automatic connection loading
            // this will sign on anew and pre-load information for the given application
            // the driver is cached using the "default" key or a specific "key" if provided
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                "username": "admin",
                "password": "admin",
                "application": appKey
            }).app(function(err) {

                // ensure stack is empty
                ok(!this.stack(), "Stack is empty");

                f2();

            });
        };

        var f2 = function()
        {
            // try again using a function callback, should produce the same result
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                "username": "admin",
                "password": "admin",
                "application": appKey
            }, function(err) {

                // ensure stack is empty
                ok(!this.stack(), "Stack is empty");

                start();
            });

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
