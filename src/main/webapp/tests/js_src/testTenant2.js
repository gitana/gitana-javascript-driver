(function($) {

    module("tenant2");

    // Test case : Tenant 2
    test("Tenant 2", function() {
        stop();

        expect(1);

        var platform = GitanaTest.authenticateFullOAuth();
        platform.then(function() {

            // NOTE: this = platform

            // create a user
            var user = null;
            this.readDefaultDomain().createUser({
                "name": "user1-" + new Date().getTime(),
                "password": "pw"
            }).then(function() {
                user = this;
            });

            this.readRegistrar("default").then(function() {

                // NOTE: this = registrar

                // create a tenant for the user
                var tenant = null;
                this.createTenant(user, {
                    "planKey": "starter"
                }).then(function() {
                    tenant = this;
                });

                // now find all tenants with this user
                this.findTenantsWithPrincipalTeamMember(user).count(function(count) {
                    equal(count, 1, "Found tenant count of 1");
                });

                this.then(function() {
                    success();
                });

            });

        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
