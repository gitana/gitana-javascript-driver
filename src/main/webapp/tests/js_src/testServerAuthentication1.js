(function($) {

    // Test case : Authentication
    module("serverAuthentication1");

    test("Authentication", function()
    {
        stop();
        expect(2);

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").then(function()
        {
            ok(gitana.ticket, "Successfully acquired ticket: " + gitana.ticket);
            ok(gitana.authenticatedUsername, "Successfully acquired username: " + gitana.authenticatedUsername);

            start();
        });
    });

}(jQuery) );