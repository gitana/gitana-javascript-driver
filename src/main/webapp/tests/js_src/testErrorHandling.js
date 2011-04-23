(function($) {

    module("error handling");
    // Test case : Error handling.
    test("Error handling", function() {
        stop();

        expect(1);
        var driver = new Gitana.Driver();
        driver.debug = true;

        var onSuccess = function(repository) {
           ok(false,"This shouldn't have been called");
            start();
        };

        var onFailure = function(http) {
            equal(http.status, 404,"Should have got back a 404!");
            start();
        };

        // kick off the test after logging in
        driver.security().authenticate("admin", "admin", function() {
            driver.repositories().read("SOMETHING_THAT_DOESNT_EXIST", onSuccess, onFailure);
        });
    });

}(jQuery) );
