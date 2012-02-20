(function($) {

    module("tenant2");

    // Test case : Tenant 2
    test("Tenant 2", function() {
        stop();

        expect(3);

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
                this.createTenant(user, "unlimited").then(function() {
                    tenant = this;
                });

                // find the tenant user on the tenant platform by using the identity
                this.then(function() {

                    // pivot on the identity
                    this.subchain(user).readIdentity().then(function() {

                        // NOTE: this = identity

                        // check to make sure that the identity now has 2 users (the original domain and the tenant platform's domain
                        this.findUsers().count(function(count) {
                            ok(count == 2, "Found 2 users for identity");
                        });

                        // check to make sure that this identity participates the new tenant (1)
                        this.findTenants().count(function(count) {
                            ok(count == 1, "Found 1 tenant for identity");
                        });

                        // check to make sure we can find the copy of the user on the tenant platform's default domain
                        this.findUserForTenant(tenant.getId()).then(function() {
                            ok(true, "Found tenant user on tenant platform domain");
                        });

                        this.then(function() {
                            success();
                        });

                    });

                });

            });

        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
