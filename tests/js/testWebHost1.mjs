import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("webhost1", function() {

    it("Web Host 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // NOTE: this = platform
                var value = "value" + new Date().getTime();

                var originalCount = -1;
                this.listWebHosts({
                    "limit": -1
                }).count(function(count) {
                    originalCount = count;
                });

                var webhost = null;
                this.createWebHost({"abc": value}).then(function() {
                    webhost = this;
                });

                this.then(function() {

                    this.listWebHosts({
                        "limit": -1
                    }).count(function(count) {
                        t.assert.equal(count, originalCount + 1, "Web Host count + 1");
                    });

                    // test query
                    this.queryWebHosts({"abc": value}).count(function(count) {
                        t.assert.equal(count, 1, "Found a query result");
                    });

                    // update and delete the web host
                    this.then(function() {

                        this.readWebHost(webhost.getId()).update().del();

                        this.listWebHosts({
                            "limit": -1
                        }).count(function(count) {
                            t.assert.equal(count, originalCount, "Web host back to what it was");
                        });

                        this.then(function() {
                            success();
                        });

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
