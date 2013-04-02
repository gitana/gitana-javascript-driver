(function($) {

    //
    // Test case : Authentication Storage 1
    //
    // Tests out the storage of OAuth2 authentication credentials.
    //
    module("authenticationStorage1");

    test("Authentication Storage 1", function()
    {
        stop();
        expect(28);

        // local storage test
        var testStorage = function(storageType, title, callback)
        {
            var gitana = new Gitana({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "storage": storageType
            });

            gitana.authenticate({ "username": "admin", "password": "admin" }).then(function() {

                // NOTE: this = platform

                ok(true, "Successfully authenticated (" + title + ")");

                // verify we have state
                var accessToken = this.getDriver().http.accessToken();
                ok(accessToken, "Found accessToken (" + title + ")");

                var refreshToken = this.getDriver().http.refreshToken();
                ok(refreshToken, "Found refreshToken (" + title + ")");

                var grantedScope = this.getDriver().http.grantedScope();
                ok(grantedScope, "Found grantedScope (" + title + ")");

                var expiresIn = this.getDriver().http.expiresIn();
                ok(expiresIn, "Found expiresIn (" + title + ")");

                var grantTime = this.getDriver().http.grantTime();
                ok(grantTime, "Found grantTime (" + title + ")");

                // log out
                this.logout().then(function() {

                    // verify the state is gone
                    var accessToken = this.getDriver().http.accessToken();
                    ok(!accessToken, "State is gone! (" + title + ")");

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

}(jQuery));