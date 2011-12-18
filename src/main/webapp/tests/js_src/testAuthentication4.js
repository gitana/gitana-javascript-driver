(function($) {

    //
    // Test case : Authentication 4
    //
    // Tests out ticket based authentication using the "opendriver" authentication scheme
    //
    module("authentication4");

    test("Authentication4", function()
    {
        stop();
        expect(4);

        var gitana = new Gitana({
            "consumerKey": GitanaTest.TEST_CONSUMER_KEY
        });

        gitana.authenticate({ "username": "admin", "password": "admin" }).then(function() {

            // NOTE: this = server

            ok(gitana.ticket, "Successfully acquired first ticket: " + gitana.ticket);

            this.listRepositories().then(function() {

                ok(true, "First authentication worked");

                // try to authenticate again using the ticket
                var gitana2 = new Gitana({
                    "consumerKey": GitanaTest.TEST_CONSUMER_KEY
                });
                gitana2.authenticate({
                    "accessTokenKey": gitana.ticket
                }).then(function() {

                    // NOTE: this = server

                    ok(gitana.ticket, "Successfully acquired second ticket: " + gitana2.ticket);

                    this.listRepositories().then(function() {

                        ok(true, "Ticket authentication worked");

                        start();
                    });
                });
            });

        });
    });

}(jQuery) );