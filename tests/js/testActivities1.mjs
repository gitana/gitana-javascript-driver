import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("activities1", function() {

    it("Activities1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
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
                        t.assert.ok(count > platformActivityCount, "Platform activity account increased");
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
                                    t.assert.ok(count > domainActivityCount, "Domain activity count increased");
                                });
                            });

                        });
                    });

                    // list platform activities
                    this.listActivities({
                        "limit": -1
                    }).count(function(count) {
                        t.assert.ok(count > platformActivityCount, "Platform activity account increased (second time)");
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
