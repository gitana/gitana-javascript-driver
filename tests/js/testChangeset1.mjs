import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("changeset1", function() {

    it("Changeset 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().then(function() {

                // NOTE: this = repository

                var n6 = null;

                // read the master branch
                this.readBranch("master").then(function() {

                    // NOTE: this = branch

                    this.createNode(); // 1
                    this.createNode(); // 2
                    this.createNode(); // 3
                    this.createNode(); // 4
                    this.createNode(); // 5
                    this.createNode().then(function() {
                        n6 = this;
                    }); // 6
                    this.createNode(); // 7
                    this.createNode(); // 8
                });

                this.then(function() {

                    // NOTE: this = repository

                    this.listChangesets().count(function(count) {
                        t.assert.equal(9, count);
                    });

                    this.queryChangesets({}).count(function(count) {
                        t.assert.equal(9, count);
                    });

                    // pick off nodes from changeset
                    this.queryChangesets().select(n6.getSystemMetadata().getChangesetId()).listNodes().count(function(count) {

                        t.assert.ok(count >= 1);

                        success();
                    });
                });

            });

            var success = function() {
                start();
            };
        });
    });
});
