(function($) {

    module("management1");

    // Test case : Management 1
    // PLANS

    test("Management 1", function()
    {
        stop();

        expect(4);

        var test = this;

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            var management = new Gitana.Management(this);

            this.subchain(management).then(function() {

                // NOTE: this = management

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
                    equal(count, originalCount + 1, "Created plan");
                });
                this.readPlan(planKey).then(function() {
                    equal(this.getPlanKey(), planKey, "Plan correct plan key");
                });

                // query test
                this.queryPlans({
                    "abc": property
                }).count(function(count) {
                    equal(1, count, "Query found with matching property");
                });

                // delete the plan
                this.readPlan(planKey).del();

                // count plans
                this.listPlans().count(function(count) {
                    equal(count, originalCount, "Plan successfully deleted");
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

}(jQuery) );
