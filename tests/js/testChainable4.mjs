import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("chainable4", function() {

    it("Chainable 4", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // create a repository
                var count = 0;
                this.createRepository()
                    .readBranch("master")
                        .createNode({ "prop": "1" })
                            .attach("default", "text/plain", "la la la")
                            .done()
                        .done()
                        .createNode({"prop": "1"})
                            .attach("default", "text/plain", "la la la")
                            .done()
                        .done()
                        .createNode({"prop": "1"})
                            .attach("default", "text/plain", "la la la")
                            .done()
                        .done()
                        .queryNodes({"prop": "1"}).each(function() {

                            this.listAttachments(true).select("default").then(function() {

                                var imageUrl = this.getDownloadUri();
                                t.assert.ok(imageUrl, "Found image url");

                                count++;

                                if (count == 3)
                                {
                                    success();
                                }
                            });
                        })
                    .done()
                .done()
            });

            var success = function()
            {
                start();
            }
        });
    });
});
