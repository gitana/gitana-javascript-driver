import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("nodeQName1", function() {

    it("Node QName 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch

                // create a node
                var node1 = null;
                this.createNode().then(function() {
                    node1 = this;
                });

                // query to verify
                this.then(function() {
                    this.queryNodes({
                        "_qname": node1.getQName()
                    }).count(function(count) {
                        t.assert.equal(1, count, "First - count was 1");
                    });
                });

                // change the qname
                this.then(function() {
                    this.subchain(node1).then(function() {
                        this.changeQName("custom:qname");
                    });
                });

                // query to verify
                this.then(function() {
                    this.queryNodes({
                        "_qname": node1.getQName()
                    }).count(function(count) {
                        t.assert.equal(0, count, "Second - count was 0");
                    });
                });

                // query to verify
                this.then(function() {
                    this.queryNodes({
                        "_qname": "custom:qname"
                    }).count(function(count) {
                        t.assert.equal(1, count, "Third - count was 1");
                    });
                });

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
