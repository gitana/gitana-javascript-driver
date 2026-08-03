import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("workQueue1", function() {

    it("Work Queue tests", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().readBranch("master").then(function() {

                // fire off 8 parallel node creates
                var factory = function(index) {
                    return function() {
                        this.createNode();
                    }
                };
                var fns = [];
                for (var i = 0; i < OPERATION_COUNT; i++)
                {
                    fns.push(factory(i));
                }
                this.then(fns).then(function() {
                    t.assert.ok(true, "Completed test");
                });
                this.then(function() {
                    success();
                });

            });

            var success = function()
            {
                start();
            };
        });
    });
});
