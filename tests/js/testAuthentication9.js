(function($) {

    //
    // Test case : Authentication 9
    //
    // Tests out authentication using a gitana ticket.
    //
    module("authentication9");

    _asyncTest("Authentication 9", function()
    {
        expect(3);

        var ticket = null;

        var gitana = new Gitana({
            "clientKey": GitanaTest.TEST_CLIENT_KEY
        });

        var f1 = function()
        {
            gitana.authenticate({ "username": "admin", "password": "admin" }).then(function() {

                // NOTE: this = platform

                ok(true, "Successfully authenticated");

                // store the ticket
                ticket = this.getDriver().getAuthInfo().getTicket();
                ok(ticket, "Found a ticket");

                // log out
                this.logout().then(function() {
                    f2();
                });

            });
        };

        var f2 = function()
        {
            gitana.authenticate({ "ticket": ticket }, function(err) {
                f3(false);
            }).then(function() {
                f3(true);
            });
        };

        var f3 = function(result)
        {
            ok(result, "Successfully authenticated");

            start();
        };

        f1();
    });

}(jQuery));