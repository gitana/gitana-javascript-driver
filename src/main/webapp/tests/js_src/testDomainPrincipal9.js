(function($) {

    module("domainPrincipal9");

    // Test case : Tests out password changes
    test("Domain Principal 9", function()
    {
        stop();

        expect(1);

        var user = null;
        var userName = "user_" + new Date().getTime();

        // start
        GitanaTest.authenticateFullOAuth().then(function() {

            // NOTE: this = platform

            // create a domain and a user
            this.createDomain().then(function() {

                // NOTE: this = domain

                // create a user and then change their password right away
                this.createPrincipal({
                    "type": "USER",
                    "name": userName,
                    "password": "abc"
                }).then(function() {

                    // NOTE: this = user
                    user = this;

                    // change the user identity's password
                    this.readIdentity().changePassword("def").then(function() {
                        f1();
                    })
                });
            });
        });

        var f1 = function()
        {
            // try logging in using old credentials
            GitanaTest.authenticate(user.getDomainQualifiedName(), "abc", null, function() {
                f2();
            }).then(function() {
                ok(false, "Should not have arrived here, authentication should have failed");
            });
        };

        var f2 = function()
        {
            // try logging in using new credentials
            GitanaTest.authenticate(user.getDomainQualifiedName(), "def", null, function() {
                ok(false, "Should not have caught error with new password, authentication should have succeeded");
            }).then(function() {
                success();
            });
        };

        var success = function()
        {
            ok(true, "Password change succeeded");
            start();
        };
    });

}(jQuery) );
