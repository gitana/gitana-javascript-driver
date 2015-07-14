(function($) {

    // tests to ensure that connect() callback fires only once even for cached connections

    module("connect8");

    // Test case : Connect 8
    _asyncTest("Connect 8", function()
    {
        expect(2);

        var appKey = "app-" + new Date().getTime();

        var f1 = function() {

            // use the connect() method to take advantage of Gitana's automatic connection loading
            // this will sign on anew and pre-load information for the given stack
            // if a "key" is provided, the driver is cached
            var callbackCount1 = 0;
            Gitana.disconnect("default");
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                "username": "admin",
                "password": "admin",
                "application": appKey,
                "key": "default"
            }, function (err) {
                callbackCount1++;
            });

            window.setTimeout(function() {

                // check callback count to ensure it is 1
                equal(1, callbackCount1, "Callback Count #1 was 1");

                f2();

            }, 4000);
        };

        var f2 = function() {

            // connect via cache
            var callbackCount2 = 0;
            Gitana.connect(function(err) {
                callbackCount2++;
            });

            window.setTimeout(function() {
                equal(1, callbackCount2, "Callback Count #2 was 1");

                Gitana.disconnect("default");

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

                this.createRepository().then(function() {
                    this.subchain(stack).assignDataStore(this, "content");
                });
                this.createDomain().then(function() {
                    this.subchain(stack).assignDataStore(this, "users");
                });
                this.createApplication({"key": appKey}).then(function() {
                    this.subchain(stack).assignDataStore(this, "app");
                });
                this.createWarehouse().then(function() {
                    this.subchain(stack).assignDataStore(this, "analytics");
                });
            }).then(function() {
                f1();
            });
        });

    });

}(jQuery) );
