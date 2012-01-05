(function($) {

    module("errorHandling1");

    // Test case : Error handling 1.
    test("Error handling 1", function()
    {
        stop();

        expect(3);

        var errorHandler = function(err)
        {
            ok(true, "caught error: " + err.msg);
            ok(err.http, "Returned error has http information.");
            equal(404 ,err.http.status, "Http status code is 404.");
            start();
        };

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.trap(errorHandler)
                .readRepository("SOMETHING_THAT_DOESNT_EXIST")
                .then(function() {

            ok(false, "This shouldn't have been called");
            start();
        });

    });

}(jQuery) );
