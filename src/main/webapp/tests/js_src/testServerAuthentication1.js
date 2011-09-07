(function($) {

    // Test case : Authentication 1
    module("serverAuthentication1");

    test("Authentication1", function()
    {
        stop();
        expect(3);

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").then(function()
        {
            // NOTE: this = server

            ok(gitana.ticket, "Successfully acquired ticket: " + gitana.ticket);
            ok(gitana.authenticatedUsername, "Successfully acquired username: " + gitana.authenticatedUsername);

            // try to authenticate again using the ticket
            var gitana2 = new Gitana();
            gitana2.authenticate(gitana.ticket).then(function() {

                // NOTE: this = server
                this.readUser("admin").then(function() {

                    ok(true, "Ticket authentication worked");

                    start();
                });
            });

        });
    });

}(jQuery) );