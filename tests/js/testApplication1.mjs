import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("application1", function() {

    it("Application 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // NOTE: this = platform

                var title = "snap-" + new Date().getTime();
                var key   = "key-" + new Date().getTime();

                var originalCount = -1;
                this.listApplications({
                    "limit": -1
                }).count(function(count) {
                    originalCount = count;
                });

                var application = null;
                this.createApplication({
                    "title": title,
                    "key": key
                }).then(function() {
                    application = this;
                });
                this.listApplications({
                    "limit": -1
                }).count(function(count) {
                    t.assert.equal(count, originalCount + 1, "Application count + 1");
                });

                // test query
                this.queryApplications({"key": key}).count(function(count) {
                    t.assert.equal(count, 1, "Found a query result");
                });

                // update and delete the application
                this.then(function() {

                    this.readApplication(application.getId()).update().del();

                    this.listApplications({
                        "limit": -1
                    }).count(function(count) {
                        t.assert.equal(count, originalCount, "Application back to what it was");
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
