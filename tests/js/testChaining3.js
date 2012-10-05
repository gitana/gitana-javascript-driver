(function($) {

    module("chaining3");

    // Test case : Speed timing test (chaining 3)
    test("Chaining 315", function()
    {
        stop();
        expect(1);

        var ITERATIONS = 100;

        // without chaining
        (function() {
            var t1 = new Date().getTime();
            var props = {};
            for (var i = 0; i < ITERATIONS; i++)
            {
                props["property" + i] = i;
            }
            var t2 = new Date().getTime();
            console.log("Without chaining, per iteration: " + ((t2-t1) / ITERATIONS));
        })();

        // chaining
        (function() {
            var t1 = new Date().getTime();
            var chain = Chain();
            var props = {};
            for (var i = 0; i < ITERATIONS; i++)
            {
                chain.then(function() {
                    props["property" + i] = i;
                });
            }
            chain.then(function() {
                var t2 = new Date().getTime();
                console.log("With chaining, per iteration: " + ((t2-t1) / ITERATIONS));

                ok(true, "tests complete");
                start();

            });
        })();
    });

}(jQuery) );
