(function($) {

    module("chaining1");

    // Test case : Chaining mechanics (101)
    test("Chaining 101", function()
    {
        stop();

        expect(7);

        // creates an empty chain {}
        Chain().then(function()
        {
            var data = {};

            // SERIAL callbacks
            //
            this.then(function() {
                data.field1 = "passed1";
           }).then(function() {
                data.field2 = "passed2";
            }).then(function() {
                data.field3 = "passed3";
            }).then(function() {
                equal("passed1", data.field1, "Chain property 1 passed (first)");
                equal("passed2", data.field2, "Chain property 2 passed (first)");
                equal("passed3", data.field3, "Chain property 3 passed (first)");


                //
                // SERIAL SUBCHAINS
                //
                // create two subchains that run back-to-back
                // this shows that we can have nested chains and also have them run serially
                //

                // subchain #1
                var data1 = {};
                this.subchain().then(function() {
                    data1.field1 = "a1";
                }).then(function() {
                    data1.field2 = "a2";
                }).then(function() {
                    equal("a1", data1.field1, "Subchain A field 1 correct (second)");
                    equal("a2", data1.field2, "Subchain A field 2 correct (second)");
                });

                // subchain #2
                var data2 = {};
                this.subchain().then(function() {
                    data2.field3 = "b1";
                }).then(function() {
                    equal("b1", data2.field3, "Subchain B field 3 correct (first)");
                });


                //
                // PARALLEL SUBCHAINS
                //
                // launch two chains in parallel
                // each chain runs a function which gets to build out the chain
                //
                // launch a couple of functions in parallel
                var x = 0;
                var f1 = function() {
                    this.then(function() {
                    }).then(function() {
                    }).then(function() {
                        x++;
                    });
                };
                var f2 = function() {
                    this.then(function() {
                    }).then(function() {
                        x = x + 100000;
                    }).then(function() {
                    }).then(function() {
                        x = x - 100000;
                    }).then(function() {
                        x = x + 7;
                    });
                };
                this.then([f1,f2]).then(function() {
                    equal(x, 8, "Parallel threads produced right value");
                });

                // after all the subchains run, we signal success
                this.then(function() {
                    success();
                });
            });
        });

        var success = function()
        {
            start();
        };
    });

}(jQuery) );
