(function($) {

    //
    // Test case : Authentication 5
    //
    // Tests out signing in, doing something and logging out
    // Ensures that authenticated operations don't work once logged out
    //
    module("authentication5");

    test("Authentication 5", function()
    {
        stop();
        expect(2);

        var trap = function(http)
        {
            ok(true, "Trap caught 403 - no authentication");
            start();
        };

        // authenticate, do something, log out and then verify we're logged out
        var gitana = new Gitana({
            "consumerKey": GitanaTest.TEST_CONSUMER_KEY
        });

        gitana.authenticate({ "username": "admin", "password": "admin" }).then(function() {

            // NOTE: this = platform

            this.createRepository();

            this.listRepositories().count(function(count) {

                ok(count > 0, "Count was greater than zero");
            });

        }).trap(trap).logout().then(function() {

            this.listRepositories().then(function() {
                ok(false, "Should not have made it this far");
            });
        });
    });

}(jQuery) );