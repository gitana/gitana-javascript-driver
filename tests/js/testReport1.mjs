import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("report1", function() {

    it("report1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(2);

        return guard(t, function(start) {
            GitanaTest.authenticateNewTenant(function() {

                // NOTE: this = platform
                var platform = this;

                this.createReport({
                    "tag": "a"
                });
                this.createReport({
                    "tag": "a"
                });
                var r = null;
                this.createReport({
                    "tag": "b"
                }).then(function() {
                    r = this;
                });

                this.listReports().count(function(count) {
                    t.assert.equal(count, 3, "Found three reports");
                });

                this.queryReports({
                    "tag": "a"
                }).count(function(count) {
                    t.assert.equal(count, 2, "Found two reports");
                });

                this.subchain(r).then(function() {

                    this.update().reload().del();

                    this.then(function() {
                        start();
                    });
                });
            });
        });
    });
});
