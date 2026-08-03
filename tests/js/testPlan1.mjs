import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("plan1", function() {

    it("Plan 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(7);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // NOTE: this = platform

                this.readRegistrar("default").then(function() {

                    // NOTE: this = registrar

                    // original count of plans
                    var originalCount = -1;
                    this.listPlans().count(function(count) {
                        originalCount = count;
                    });

                    // create another plan
                    var property = "def-" + new Date().getTime();
                    var planKey = "abc-" + new Date().getTime();
                    this.createPlan({
                        "planKey": planKey,
                        "abc": property
                    });
                    this.listPlans().count(function(count) {
                        t.assert.equal(count, originalCount + 1, "Created plan");
                    });
                    this.readPlan(planKey).then(function() {
                        t.assert.equal(this.getPlanKey(), planKey, "Plan correct plan key");
                    });

                    // query test
                    this.queryPlans({
                        "abc": property
                    }).count(function(count) {
                        t.assert.equal(1, count, "Query found with matching property");
                    });

                    // delete the plan
                    this.readPlan(planKey).del();

                    // count plans
                    this.listPlans().count(function(count) {
                        t.assert.equal(count, originalCount, "Plan successfully deleted");
                    });

                    // validate the error status for reading non-existing plan
                    this.trap(function(error) {
                        t.assert.equal(error.status, 404, "404 status code received");
                        t.assert.ok(error.statusText, "Found error status text");
                        t.assert.ok(error.message, "Found error message");
                        success();
                    }).readPlan(planKey).then(function() {

                    });


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
    });
});
