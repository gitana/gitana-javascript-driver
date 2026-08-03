import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("chainable3", function() {

    it("Chainable 3", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(4);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // create a repository
                this.createRepository().readBranch("master").then(function()
                {
                    var count = 0;

                    // create three nodes
                    this.createNode({ "prop": "1" }).then(function() {
                        this.attach("default", "text/plain", "la la la");
                    });
                    this.createNode({ "prop": "1" }).then(function() {
                        this.attach("default", "text/plain", "la la la");
                    });
                    this.createNode({ "prop": "1" }).then(function() {
                        this.attach("default", "text/plain", "la la la");
                    });

                    // query for nodes
                    this.queryNodes({
                        "prop": "1"
                    }).count(function(c) {
                        t.assert.ok(3, c, "Count was 3");
                    }).each(function() {

                        this.listAttachments(true).select("default").then(function() {

                            var imageUrl = this.getDownloadUri();
                            t.assert.ok(imageUrl, "Found image url");

                            count++;

                            if (count === 3)
                            {
                                success();
                            }
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
