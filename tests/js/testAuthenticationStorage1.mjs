import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("authenticationStorage1", function() {

    it("Authentication Storage 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(28);

        return guard(t, function(start) {
            // local storage test
            var testStorage = function(storageType, title, callback)
            {
                Gitana.reset();
                var gitana = new Gitana({
                    "clientKey": GitanaTest.TEST_CLIENT_KEY,
                    "storage": storageType
                });

                gitana.authenticate({ "username": "admin", "password": "admin" }, function(err) {
                    console.warn(err);
                    start();
                    return;
                }).then(function() {

                    // NOTE: this = platform

                    t.assert.ok(true, "Successfully authenticated (" + title + ")");

                    // verify we have state
                    var accessToken = this.getDriver().http.accessToken();
                    t.assert.ok(accessToken, "Found accessToken (" + title + ")");

                    var refreshToken = this.getDriver().http.refreshToken();
                    t.assert.ok(refreshToken, "Found refreshToken (" + title + ")");

                    var grantedScope = this.getDriver().http.grantedScope();
                    t.assert.ok(grantedScope, "Found grantedScope (" + title + ")");

                    var expiresIn = this.getDriver().http.expiresIn();
                    t.assert.ok(expiresIn, "Found expiresIn (" + title + ")");

                    var grantTime = this.getDriver().http.grantTime();
                    t.assert.ok(grantTime, "Found grantTime (" + title + ")");

                    // log out
                    this.logout().then(function() {

                        // verify the state is gone
                        var accessToken = this.getDriver().http.accessToken();
                        t.assert.ok(!accessToken, "State is gone! (" + title + ")");

                        callback();
                    });
                });
            };

            testStorage(null, "Null Storage (Memory Default)", function() {
                testStorage("memory", "Memory Storage", function() {

                    localStorage.removeItem("gitanaAuthState");
                    testStorage("local", "Local Storage", function() {

                        sessionStorage.removeItem("gitanaAuthState");
                        testStorage("session", "Session Storage", function() {
                            start();
                        });
                    });

                });
            });
        });
    });
});
