(function($) {

    // Test case : Authentication 3
    module("serverAuthentication3");

    test("Authentication 3", function()
    {
        stop();
        expect(2);

        // try to authenticate with invalid credentials and verify that our handler catches
        // NOTE: we can't use traps because the chain hasn't started yet
        // (the authenticate method is actually responsible for building the chain!)
        //
        // so the authenticate() method lets us pass in a handler explicitly
        // one of the few exceptions
        //

        var authFailedHandler = function(http)
        {
            // NOTE: this = server

            ok(true, "Trap caught bad credentials - good");

            // now try to re-authenticate
            this.authenticate("admin", "admin").then(function() {

                // NOTE: this = server

                ok(true, "Successfully logged in");

                start();
            });

        };

        // try to authenticate with invalid credentials and verify we hit the auth failure handler
        var gitana = new Gitana();
        gitana.authenticate("admin", "admin2", authFailedHandler).then(function() {
            ok(false, "Should not have made it this far");
        });
    });

}(jQuery) );