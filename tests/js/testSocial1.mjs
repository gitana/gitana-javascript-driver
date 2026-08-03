import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("social1", function() {

    it("Basic Comment/Rating behavior", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch;

                var product = null;
                this.createNode().then(function() {
                    product = this;
                });

                var object = {
                    "_type": "n:comment",
                    "rating": 3
                };
                var comment = null;
                this.createNode(object).then(function() {
                    comment = this;
                });

                this.then(function() {

                    // associate them
                    this.subchain(product).then(function() {

                        // NOTE: this = product

                        this.associate(comment, "a:has_comment");
                        this.reload().then(function() {

                            var ratingTotalCount = this.stats()["ratingTotalCount"];
                            t.assert.equal(ratingTotalCount, 1, "Total Count was 1");
                            var ratingTotalValue = this.stats()["ratingTotalValue"];
                            t.assert.equal(ratingTotalValue, 3, "Total Value was 3");
                            var ratingAverageValue = this.stats()["ratingAverageValue"];
                            t.assert.equal(ratingAverageValue, 3.0, "Average Value was 3");

                        });
                    });
                });

                // success
                this.then(function() {
                    success();
                });
            });

            var success = function() {
                start();
            };
        });
    });
});
