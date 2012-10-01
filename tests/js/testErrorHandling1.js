(function($) {

    module("errorHandling1");

    // Test case : Error handling 1.
    test("Error handling 1", function()
    {
        stop();

        expect(4);

        /**
         * Error handling should have:
         *
         *   {
         *     "status": <status code>,
         *     "statusText": "<status text>",
         *     "message": <detailed message>"
         *   }
         *
         * @param err
         */
        var errorHandler = function(err)
        {
            ok(err.status, "Caught error has status field");
            ok(err.statusText, "Caught error has status text field");
            ok(err.message, "Caught error has message field");
            equal(err.status, 404, "Status code is 404.");
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
