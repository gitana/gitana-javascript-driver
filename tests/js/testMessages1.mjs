import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("messages1", function() {

    it("Messages1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(4);

        return guard(t, function(start) {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.then(function() {

                // NOTE: this = platform

                var platform = this;

                // create a application
                this.createApplication().then(function() {

                    // NOTE: this = application

                    var application = this;

                    // ensure zero messages at onset
                    this.listMessages().count(function(count) {
                        t.assert.equal(count, 0, "No messages");
                    });

                    // create a message
                    this.createMessage({
                        "key": "a.b.c",
                        "locale": "en_US",
                        "message": "message1"
                    });

                    // query for messages
                    this.queryMessages({
                        "key": "a.b.c"
                    }).count(function(c) {
                        t.assert.equal(c, 1, "Count was 1");
                    }).keepOne().then(function() {

                        // this = message
                        this.key = "d.e.f";
                        this.update().then(function() {

                        });
                    });

                    // query again
                    this.queryMessages({
                        "key": "d.e.f"
                    }).count(function(c) {
                        t.assert.equal(c, 1, "Count was 1");
                    }).keepOne().then(function() {

                        // delete it
                        this.del();
                    });

                    // query again
                    this.queryMessages().count(function(c) {
                        t.assert.equal(c, 0, "Count was 0");
                    }).then(function() {
                        success();
                    });

                });

            });

            var success = function()
            {
                start();
            };
        });
    });
});
