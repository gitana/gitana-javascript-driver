(function($) {

    //
    // Test case : Authentication 5
    //
    // Tests out signing in, doing something and logging out
    // Ensures that authenticated operations don't work once logged out
    //
    module("authentication5");

    _asyncTest("Authentication 5", function()
    {
        expect(3);

        var trap = function(http)
        {
            ok(true, "Trap caught 403 - no authentication");
            start();
        };

        // authenticate, do something, log out and then verify we're logged out
        var gitana = new Gitana({
            "clientKey": GitanaTest.TEST_CLIENT_KEY
        });

        gitana.authenticate({ "username": "admin", "password": "admin" }).then(function() {

            // NOTE: this = platform

            this.createRepository();

            this.listRepositories({
                "limit": -1
            }).count(function(count) {

                ok(count > 0, "Count was greater than zero");
            });

        }).trap(trap).logout().then(function() {

            // cookie should be gone
            ok(!Gitana.readCookie("GITANA_TICKET", "Cookie was deleted"));

            this.listRepositories({
                "limit": -1
            }).then(function() {
                ok(false, "Should not have made it this far");
            });
        });
    });

}(jQuery) );