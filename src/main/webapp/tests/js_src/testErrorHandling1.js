(function($) {

    module("errorHandling1");

    // Test case : Error handling 1.
    test("Error handling 1", function()
    {
        stop();

        expect(1);

        var errorHandler = function(err)
        {
            ok(true, "caught error: " + err.msg);
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
