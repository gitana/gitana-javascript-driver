import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("platformInfo1", function() {

    it("Platform info", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(2);

        return guard(t, function(start) {
            GitanaTest.authenticateFullOAuth().then(function() {

                // NOTE: this = platform

                this.createDomain();
                this.createRepository();

                this.loadInfo(function(object) {

                    if (object["datastore_counts"])
                    {
                        t.assert.ok(true, "Found datastore_counts");

                        if (object["datastore_counts"]["domain"] > 0)
                        {
                            t.assert.ok(true, "More than 1 domain");
                        }
                    }

                    start();
                });
            });
        });
    });
});
