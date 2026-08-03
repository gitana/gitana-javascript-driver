import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("domain2", function() {

    it("Domain Map operations", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(5);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // NOTE: this = platform

                var segment = "segment-" + new Date().getTime();

                // create 3 domains
                this.createDomain({"segment": segment});
                this.createDomain({"segment": segment});
                this.createDomain({"segment": segment});

                // query domains
                var total = 0;
                this.queryDomains({"segment": segment}, {"limit": 2, "skip": 1}).each(function() {
                    total++;
                }).totalRows(function(totalRows) {
                    t.assert.equal(totalRows, 3, "Found total rows == 3"); // total rows == 1
                }).size(function(size) {
                    t.assert.equal(size, 2, "Found size == 2")
                }).offset(function(offset) {
                    t.assert.equal(offset, 1, "Found offset == 1"); // offset == 0
                }).count(function(count) {
                    t.assert.equal(count, 2, "Found count == 2");
                }).then(function() {
                    t.assert.equal(2, total, "Map has total of 2");
                    start();
                });
            });
        });
    });
});
