(function($) {

    // try to authenticate with invalid credentials and verify that our handler catches
    // NOTE: we can't use traps because the chain hasn't started yet
    // (the authenticate method is actually responsible for building the chain!)
    //
    // so the authenticate() method lets us pass in a handler explicitly
    // one of the few exceptions
    //

    // Test case : Authentication 6
    module("authentication6");

    test("Authentication 6", function()
    {
        stop();
        expect(2);

        var authFailedHandler = function(http)
        {
            // NOTE: this = platform

            ok(true, "Trap caught bad credentials - good");

            // now try to re-authenticate
            this.authenticate({"username":"admin", "password":"admin"}).then(function() {

                // NOTE: this = platform

                ok(true, "Successfully logged in");

                start();
            });

        };

        // try to authenticate with invalid credentials and verify we hit the auth failure handler
        // authenticate, do something, log out and then verify we're logged out
        var gitana = new Gitana({
            "clientId": GitanaTest.TEST_CLIENT_ID
        });

        // this first authentication will work just fine
        gitana.authenticate({ "username": "admin", "password": "admin" }).then(function() {

            // this one will fail
            console.log("Calling second!");
            gitana.authenticate({"username":"admin", "password":"admin2"}, authFailedHandler).then(function() {
                ok(false, "Should not have made it this far");
            });
        });
    });

}(jQuery) );