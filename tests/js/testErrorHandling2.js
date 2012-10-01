(function($) {

    module("errorHandling2");

    // Test case : Error handling 2.
    test("Error handling 2", function()
    {
        stop();

        expect(3);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            var errorHandler = function(err)
            {
                ok(true, "caught error: " + err.msg);
                start();
            };

            // create a deeply nested chain and ensure that throwing in the middle cancels both downward and upward

            var count = 0;
            var boo = 9;

            this.trap(function(err) {
                equal(count, 3, "Count was 3 on error");

                // sequence a new chain
                this.then(function() {
                    this.then(function() {
                        this.then(function() {
                            var finisher = function(chain) {

                                return function() {
                                    chain.next();
                                };
                            }(this);

                            window.setTimeout(finisher, 500);

                            return false;
                        });
                    });
                });
                this.then(function() {
                    equal(count, 3, "Count was still 3");
                    equal(boo, 9, "Boo was 9");
                    success();
                });
            });

            this.then(function() {
                count++;

                this.then(function() {
                    count++;

                    this.then(function() {
                        count++;

                        var err = new Error();
                        err.message = "go boom";
                        this.error(err);

                        this.then(function() {
                            count++;
                        });

                        this.then(function() {
                            count++;

                            this.then(function() {
                                count++;
                            });
                        });

                        this.then(function() {
                            count++;
                        });
                    });

                    this.then(function() {
                        count++;
                        boo = 15;
                    });

                    this.then(function() {
                        count++;
                    });
                });

                this.then(function() {
                    count++;
                });
            });
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
