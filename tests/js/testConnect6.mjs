import { describe, it } from "node:test";
import { Gitana, guard } from "../support.mjs";

describe("connect6", function() {

    it("Gitana Connect #6", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(0);

        return guard(t, function(start) {
            // IGNORE THIS TEST
            start();
            return;

            t.plan(3);

            var connectConfig = {};
            //connectConfig["host"] = "https://43e8a6e1-aec3-44a7-b475-91deea426749-hosted.cloudcms.net";
            //connectConfig["baseURL"] = "https://43e8a6e1-aec3-44a7-b475-91deea426749-hosted.cloudcms.net/proxy";
            connectConfig["baseURL"] = "http://t3.splashcds.com/oapi";
            //connectConfig["baseURL"] = "t3.splashcds.com/oapi";

            console.log("Running connect6 with config: " + JSON.stringify(connectConfig));

            var f1 = function()
            {
                Gitana.connect(connectConfig, function(err) {

                    // NOTE: this = platform
                    t.assert.ok(!err, "Connected successfully as guest using connect()");

                    Gitana.disconnect();

                    // ensure the cookie is gone
                    t.assert.ok(!Gitana.readCookie("GITANA_TICKET", "Cookie was deleted"));

                    f2();
                });
            };

            var f2 = function()
            {
                var cloud = new Gitana(connectConfig);
                cloud.authenticate().then(function() {

                    t.assert.ok(true, "Connected successfully as guest using authenticate()");

                    start();
                });
            };

            f1();
        });
    });
});
