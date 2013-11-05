(function($) {

    module("activities1");

    // Test case : Activities
    _asyncTest("Activities1", function()
    {
        expect(3);

        GitanaTest.authenticateFullOAuth().then(function()
        {
            // NOTE: this = platform

            var platformActivityCount = -1;
            this.listActivities({
                "limit": -1
            }).count(function(count) {
                platformActivityCount = count;
            });

            // create a domain
            var domain = null;
            this.createDomain().then(function() {

                // NOTE: this = domain;

                domain = this;
            });

            this.then(function() {

                // list platform activities
                this.listActivities({
                    "limit": -1
                }).count(function(count) {
                    ok(count > platformActivityCount, "Platform activity account increased");
                    platformActivityCount = count;
                });

                // subchain to DOMAIN
                this.then(function() {

                    this.subchain(domain).then(function() {

                        // list domain activities
                        var domainActivityCount = -1;
                        this.listActivities({
                            "limit": -1
                        }).count(function(count) {
                            domainActivityCount = count;
                        });

                        this.then(function() {

                            // create a user on the domain
                            this.createUser({
                                "name": "bob-" + new Date().getTime()
                            });

                            // list domain activities
                            this.listActivities({
                                "limit": -1
                            }).count(function(count) {
                                ok(count > domainActivityCount, "Domain activity count increased");
                            });
                        });

                    });
                });

                // list platform activities
                this.listActivities({
                    "limit": -1
                }).count(function(count) {
                    ok(count > platformActivityCount, "Platform activity account increased (second time)");
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
