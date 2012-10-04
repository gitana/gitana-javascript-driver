(function() {

    module("connect1");

    // Test case : Gitana Connect #1
    test("Gitana Connect #1", function()
    {
        stop();

        expect(23);

        var appKey = "app-" + new Date().getTime();

        var f1 = function()
        {
            // use the connect() method to take advantage of Gitana's automatic context caching
            // this will sign on anew and pre-load information for the given stack
            // if a "key" is provided, the driver is cached
            Gitana.connect({
                    "clientKey": GitanaTest.TEST_CLIENT_ID,
                    "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                    "username": "admin",
                    "password": "admin"
                })
                .app(appKey)
                .datastore("content", function(err) {
                    ok(!err, "Found content");
                    ok(this.readBranch, "Repository has readBranch");
                })
                .datastore("users", function(err) {
                    ok(!err, "Found users");
                    ok(this.readPrincipal, "Domain has readPrincipal");
                    ok(!this.readPrincipalXXX, "Domain does not have readPrincipalXXX");
                })
                .datastore("app", function(err) {
                    ok(!err, "Found app");
                })
                .datastore("analytics", function(err) {
                    ok(!err, "Found analytics");
                })
                .then(function() {
                    f2();
                })
        };

        var f2 = function()
        {
            // now request again, should incur no reload
            var count1 = Gitana.requestCount;
            Gitana.connect()
                .app()
                .datastore("content", function(err) {
                    ok(!err, "Found content");
                })
                .datastore("users", function(err) {
                    ok(!err, "Found users");
                })
                .datastore("app", function(err) {
                    ok(!err, "Found app");
                })
                .datastore("analytics", function(err) {
                    ok(!err, "Found analytics");
                })
                .then(function() {
                    equal(Gitana.requestCount, count1, "Request count did not go up");
                    f3();
                });
        };

        var f3 = function()
        {
            // and again, using only string
            var count2 = Gitana.requestCount;
            Gitana.connect()
                .app()
                .datastore("content", function(err) {
                    ok(!err, "Found content");
                })
                .datastore("users", function(err) {
                    ok(!err, "Found users");
                })
                .datastore("app", function(err) {
                    ok(!err, "Found app");
                })
                .datastore("analytics", function(err) {
                    ok(!err, "Found analytics");
                })
                .then(function() {
                    equal(Gitana.requestCount, count2, "Request count did not go up");
                    f4();
                });
        };

        var f4 = function()
        {
            // now disconnect
            Gitana.disconnect();
            ok(true, "Successfully disconnected");

            // now connect and ensure re-authentication
            var count3 = Gitana.requestCount;
            Gitana.connect({
                    "clientKey": GitanaTest.TEST_CLIENT_ID,
                    "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                    "username": "admin",
                    "password": "admin"
                })
                .app(appKey)
                .datastore("content", function(err) {
                    ok(!err, "Found content");
                })
                .datastore("users", function(err) {
                    ok(!err, "Found users");
                })
                .datastore("app", function(err) {
                    ok(!err, "Found app");
                })
                .datastore("analytics", function(err) {
                    ok(!err, "Found analytics");
                })
                .then(function() {
                    ok(Gitana.requestCount > count3, "Request count increased");
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

}());
