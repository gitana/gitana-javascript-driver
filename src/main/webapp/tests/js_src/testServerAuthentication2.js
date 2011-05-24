(function($) {

    // Test case : Authentication 2
    module("serverAuthentication2");

    test("Authentication 2", function()
    {
        stop();
        expect(2);

        var trap = function(http)
        {
            ok(true, "Trap caught 403 - no authentication");
            start();
        };

        // authenticate, do something, log out and then verify we're logged out
        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").then(function() {

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