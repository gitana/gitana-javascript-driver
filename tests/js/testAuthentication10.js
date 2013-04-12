(function($) {

    //
    // Test case : Authentication 10
    //
    // Tests out ticket-based authentication and sustenance of multiple authInfo's.
    //
    module("authentication10");

    test("Authentication 10", function()
    {
        stop();
        expect(4);

        var gitana = new Gitana({
            "clientKey": GitanaTest.TEST_CLIENT_KEY
        });

        var userName1 = "testuser1-" + new Date().getTime();
        var userName2 = "testuser2-" + new Date().getTime();

        var ticket1 = null;
        var ticket2 = null;

        var f1 = function()
        {
            gitana.authenticate({ "username": "admin", "password": "admin" }).then(function() {

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
            gitana.authenticate({
                "username": userName1,
                "password": "test"
            }).then(function() {

                // store the ticket
                ticket1 = this.getDriver().getAuthInfo().getTicket();
                ok(ticket1, "Found ticket #1");
                this.logout().then(function() {
                    f3();
                });

            });
        };

        var f3 = function()
        {
            gitana.authenticate({
                "username": userName2,
                "password": "test"
            }).then(function() {

                // store the ticket
                ticket2 = this.getDriver().getAuthInfo().getTicket();
                ok(ticket2, "Found ticket #2");
                this.logout().then(function() {
                    f4();
                });

            });
        };

        var f4 = function()
        {
            gitana.authenticate({ "ticket": ticket1 }).then(function() {

                // NOTE: this = platform

                var authInfo = this.getDriver().getAuthInfo();
                equal(authInfo.getPrincipalName(), userName1);

                f5();
            });
        };

        var f5 = function()
        {
            gitana.authenticate({ "ticket": ticket2 }).then(function() {

                // NOTE: this = platform

                var authInfo = this.getDriver().getAuthInfo();
                equal(authInfo.getPrincipalName(), userName2);

                start();
            });
        };

        f1();
    });

}(jQuery) );