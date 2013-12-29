(function() {

    //
    // Test case : Authentication 11
    //
    // Tests out ticket-based authentication and sustenance of multiple authInfo's.
    //
    module("authentication11");

    _asyncTest("Authentication 11", function()
    {
        expect(4);

        var userName1 = "testuser1-" + new Date().getTime();
        var userName2 = "testuser2-" + new Date().getTime();

        var ticket1 = null;
        var ticket2 = null;

        var f1 = function()
        {
            Gitana.reset();
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "username": "admin",
                "password": "admin"
            }, function(err) {

                // NOTE: this = platform

                this.readPrimaryDomain().then(function() {

                    // NOTE: this = domain

                    // create user #1
                    this.createUser({
                        "name": userName1,
                        "password": "test"
                    });

                    // create user #2
                    this.createUser({
                        "name": userName2,
                        "password": "test"
                    });

                    this.then(function() {
                        f2();
                    });
                });
            });
        };

        var f2 = function()
        {
            Gitana.reset();
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "username": userName1,
                "password": "test"
            }, function(err) {

                // NOTE: this = platform

                // store the ticket
                ticket1 = this.getDriver().getAuthInfo().getTicket();
                ok(ticket1, "Found ticket #1");

                //console.log("TICKET #1: " + ticket1);

                f3();
            });
        };

        var f3 = function()
        {
            Gitana.reset();
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "username": userName2,
                "password": "test"
            }, function(err) {

                // NOTE: this = platform

                // store the ticket
                ticket2 = this.getDriver().getAuthInfo().getTicket();
                ok(ticket2, "Found ticket #2");

                //console.log("TICKET #2: " + ticket2);

                f4();
            });
        };

        var f4 = function()
        {
            Gitana.reset();
            Gitana.connect({
                "ticket": ticket1
            }, function(err) {

                // NOTE: this = platform

                var authInfo = this.getDriver().getAuthInfo();
                //console.log("USER 4: " + this.getDriver().getAuthInfo().getPrincipalName());
                equal(authInfo.getPrincipalName(), userName1);

                f5();
            });
        };

        var f5 = function()
        {
            Gitana.reset();
            Gitana.connect({
                "ticket": ticket2
            }, function(err) {

                // NOTE: this = platform

                var authInfo = this.getDriver().getAuthInfo();
                //console.log("USER 5: " + this.getDriver().getAuthInfo().getPrincipalName());
                equal(authInfo.getPrincipalName(), userName2);

                start();
            });
        };

        f1();
    });

}());