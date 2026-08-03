import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("authentication10", function() {

    it("Authentication 10", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(4);

        return guard(t, function(start) {
            var gitana = new Gitana({
                "clientKey": GitanaTest.TEST_CLIENT_KEY
            });

            var userName1 = "testuser1-" + new Date().getTime();
            var userName2 = "testuser2-" + new Date().getTime();

            var ticket1 = null;
            var ticket2 = null;

            var f1 = function()
            {
                Gitana.reset();
                gitana.authenticate({ "username": "admin", "password": "admin" }, function(err) {
                    console.warn(err);
                    start();
                    return;
                }).then(function() {

                    // NOTE: this = platform

                    this.readPrimaryDomain().then(function() {

                        // NOTE: this = domain

                        // create user #1
                        this.createUser({
                            "name": userName1,
                            "password": "test1234"
                        });

                        // create user #2
                        this.createUser({
                            "name": userName2,
                            "password": "test1234"
                        });

                        this.then(function() {
                            f2();
                        });
                    });
                });
            };

            var f2 = function()
            {
                Gitana.reset();
                gitana.authenticate({
                    "username": userName1,
                    "password": "test1234"
                }, function(err) {
                    console.warn(err);
                    start();
                    return;
                }).then(function() {

                    // store the ticket
                    ticket1 = this.getDriver().getAuthInfo().getTicket();
                    t.assert.ok(ticket1, "Found ticket #1");
                    this.logout().then(function() {
                        f3();
                    });

                });
            };

            var f3 = function()
            {
                Gitana.reset();
                gitana.authenticate({
                    "username": userName2,
                    "password": "test1234"
                }, function(err) {
                    console.warn(err);
                    start();
                    return;
                }).then(function() {

                    // store the ticket
                    ticket2 = this.getDriver().getAuthInfo().getTicket();
                    t.assert.ok(ticket2, "Found ticket #2");
                    this.logout().then(function() {
                        f4();
                    });

                });
            };

            var f4 = function()
            {
                Gitana.reset();
                gitana.authenticate({ "ticket": ticket1 }, function(err) {
                    t.assert.ok(false, "Failed to authenticate with ticket1");
                    start();
                }).then(function() {

                    // NOTE: this = platform

                    var authInfo = this.getDriver().getAuthInfo();
                    t.assert.equal(authInfo.getPrincipalName(), userName1);

                    f5();
                });
            };

            var f5 = function()
            {
                Gitana.reset();
                gitana.authenticate({ "ticket": ticket2 }, function(err) {
                    t.assert.ok(false, "Failed to authenticate with ticket2");
                    start();
                }).then(function() {

                    // NOTE: this = platform

                    var authInfo = this.getDriver().getAuthInfo();
                    t.assert.equal(authInfo.getPrincipalName(), userName2);

                    start();
                });
            };

            f1();
        });
    });
});
