import { describe, it } from "node:test";
import { Gitana, guard } from "../support.mjs";

describe("connect5", function() {

    it("Gitana Connect #5", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
            Gitana.HTTP_X_CLOUDCMS_ORIGIN_HEADER = false;

            var host = "https://43e8a6e1-aec3-44a7-b475-91deea426749-hosted.cloudcms.net";
            var baseURL = host + "/proxy";

            // connects using CORS to a hosted cloud cms application proxy (as the guest/guest user)
            var f1 = function(callback)
            {
                Gitana.connect({
                    "baseURL": baseURL,
                    "username": "guest",
                    "password": "guest"
                }, function() {

                    // NOTE: this = platform
                    t.assert.ok(this, "Found platform f1");

                    callback();
                });
            };

            // connects using CORS to a hosted cloud cms application (as the guest/guest user)
            var f2 = function(callback)
            {
                Gitana.connect({
                    "host": host,
                    "username": "guest",
                    "password": "guest"
                }, function() {

                    // NOTE: this = platform
                    t.assert.ok(this, "Found platform f2");

                    callback();
                });
            };

            // connects using CORS to a hosted cloud cms application (as the default guest/guest user)
            var f3 = function(callback)
            {
                Gitana.connect({
                    "host": host
                }, function() {

                    // NOTE: this = platform
                    t.assert.ok(this, "Found platform f3");

                    callback();
                });
            };

            f1(function() {
                f2(function() {
                    f3(function() {

                        Gitana.HTTP_X_CLOUDCMS_ORIGIN_HEADER = true;
                        start();
                    });
                });
            });
        });
    });
});
