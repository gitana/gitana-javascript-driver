(function() {

    module("connect1");

    // Test case : Gitana Connect #1
    _asyncTest("Gitana Connect #1", function()
    {
        expect(16);

        var appKey = "app-" + new Date().getTime();

        var f1 = function()
        {
            // use the connect() method to take advantage of Gitana's automatic connection loading
            // this will sign on anew and pre-load information for the given stack
            // if a "key" is provided, the driver is cached
            Gitana.disconnect("default");
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                "username": "admin",
                "password": "admin",
                "application": appKey,
                "key": "default"
            }).app({
                "appCacheKey": "xyz"
            },
            function(err) {

                // this = app helper
                var ah = this;

                ah.datastore("content").listBranches().then(function() {
                    ok(true, "Pass 1 - Found content");

                    ah.datastore("users").listUsers().then(function() {
                        ok(true, "Pass 1 - Found users");

                        ah.datastore("app").then(function() {
                            ok(true, "Pass 1 - Found app");

                            f2();
                        });
                    });
                });
            });
        };

        var f2 = function()
        {
            // now request again, should incur no reload
            var count1 = Gitana.requestCount;
            Gitana.connect({
                "key": "default"
            }).app({
                "appCacheKey": "xyz"
            },function(err) {

                // this = app helper
                var ah = this;

                ah.datastore("content").then(function() {
                    ok(true, "Pass 2 - Found content");

                    ah.datastore("users").then(function() {
                        ok(true, "Pass 2 - Found users");

                        ah.datastore("app").then(function() {
                            ok(true, "Pass 2 - Found app");

                            equal(Gitana.requestCount, count1, "Request count did not go up");
                            f3();
                        });
                    });
                });
            });
        };

        var f3 = function()
        {
            // and again, this time using connect() callback
            var count2 = Gitana.requestCount;
            Gitana.connect({
                "key": "default",
                "appCacheKey": "xyz"
            }, function(err) {

                // this = app helper
                var ah = this;

                ah.datastore("content").then(function() {
                    ok(true, "Pass 3 - Found content");

                    ah.datastore("users").then(function() {
                        ok(true, "Pass 3 - Found users");

                        ah.datastore("app").then(function() {
                            ok(true, "Pass 3 - Found app");

                            equal(Gitana.requestCount, count2, "Request count did not go up");
                            f4();
                        });
                    });
                });
            });
        };

        var f4 = function()
        {
            // now disconnect
            Gitana.disconnect({
                "key": "default"
            });
            ok(true, "Successfully disconnected");

            // now connect and ensure re-authentication
            // this time we split the appKey out into the call to app()
            var count3 = Gitana.requestCount;
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                "username": "admin",
                "password": "admin",
                "key": "default"
            }).app({
                "application": appKey
            }, function(err) {

                // this = app helper
                var ah = this;

                ah.datastore("content").then(function() {
                    ok(true, "Pass 4 - Found content");

                    ah.datastore("users").then(function() {
                        ok(true, "Pass 4 - Found users");

                        ah.datastore("app").then(function() {
                            ok(true, "Pass 4 - Found app");

                            ok(Gitana.requestCount > count3, "Request count increased");
                            success();
                        });
                    });
                });
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
            }).then(function() {
                f1();
            });
        });

    });

}());
