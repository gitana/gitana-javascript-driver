import { describe, it } from "node:test";
import { Gitana, Chain, guard } from "../support.mjs";

describe("chaining3", function() {

    it("Chaining 315", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
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

                    t.assert.ok(true, "tests complete");
                    start();

                });
            })();
        });
    });
});
