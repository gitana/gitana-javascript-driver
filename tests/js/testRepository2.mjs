import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("repository2", function() {

    it("Repository Chaining", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(1);

        return guard(t, function(start) {
            var filter = function()
            {
                return (this.getId() != "gitana");
            };
            var comparator = function(a, b)
            {
                // less than zero => sort "a" to be a lower index than "b"
                // zero => "a" and "b" are equal, no sorting
                // greater than zero => sort 'b" to be a lower index than "a"
                return (0.5 - Math.random());
            };

            var count = 0;

            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // NOTE: this = platform

                // create one repository
                this.createRepository().then(function() {
                    var repo1 = this;
                });

                // create another repository
                this.createRepository().then(function() {
                    var repo2 = this;
                });

                // now test some chaining
                this.listRepositories({
                    "limit": -1
                }).filter(filter).sort(comparator).limit(2).each(function() {
                    count++;
                }).then(function() {
                    t.assert.equal(count, 2, "Counted 2");

                    // signal end of test
                    success();
                });
            });

            var success = function()
            {
                start();
            };
        });
    });
});
