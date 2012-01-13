(function($) {

    module("tenant1");

    // Test case : Tenant 1
    // TENANTS

    test("Tenant 1", function()
    {
        stop();

        expect(4);

        var test = this;

        var platform = GitanaTest.authenticateFullOAuth();
        platform.then(function() {

            // NOTE: this = platform

            // create a user
            var user = null;
            var username = "user-" + new Date().getTime();
            this.readDefaultDomain().createUser({
                "name": username
            }).then(function() {
                user = this;
            });

            this.readRegistrar("default").then(function() {

                // NOTE: this = registrar

                // original count of tenants
                var originalCount = -1;
                this.listTenants().count(function(count) {
                    originalCount = count;
                });

                // create a tenant for our user
                var property = "prop-" + new Date().getTime();
                var tenant = null;
                this.createTenant(user, {
                    "planKey": "starter"
                }).then(function() {
                    tenant = this;
                });

                // list tenants and confirm size change
                this.listTenants().count(function(count) {
                    equal(count, originalCount + 1, "Tenant size increased by 1");
                });

                // query tenants
                this.queryTenants({
                    "planKey": "starter"
                }).count(function(count) {
                    ok(count > 0, "Found at least one starter");
                });

                // find tenant for principal
                this.lookupTenantForPrincipal(user).then(function() {
                    equal(tenant.getId(), this.getId(), "Found tenant by principal");
                });

                // delete the tenant
                this.then(function() {
                    this.readTenant(tenant.getId()).del();
                });

                // count tenants
                this.listTenants().count(function(count) {
                    equal(count, originalCount, "Tenant successfully deleted");
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
