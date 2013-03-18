(function($) {

    module("billingProviderConfiguration1");

    // Test case : Billing Provider Configuration 1

    test("Billing Provider Configuration 1", function()
    {
        stop();

        expect(3);

        var test = this;

        var platform = GitanaTest.authenticateFullOAuth();
        platform.then(function() {

            // NOTE: this = platform

            // create a user
            var user = null;
            var username = "user-" + new Date().getTime();
            this.readPrimaryDomain().createUser({
                "name": username,
                "password": "pw"
            }).then(function() {
                user = this;
            });

            this.readRegistrar("default").then(function() {

                // NOTE: this = registrar

                // create a tenant for our user
                var clientConfig = null;
                this.createTenant(user, "unlimited").then(function() {

                    // NOTE: this = tenant

                    // read the default client
                    this.readDefaultAllocatedClientObject(function(theClientConfig) {
                        clientConfig = theClientConfig;
                    });

                });

                this.then(function() {

                    // sign in as the new tenant
                    new Gitana({
                        "clientKey": clientConfig.getKey(),
                        "clientSecret": clientConfig.getSecret()
                    }).authenticate({
                        "username": user.getName(),
                        "password": "pw"
                    }).then(function() {

                        // NOTE: this = platform

                        // create three billing provider configurations
                        var bpc1 = null;
                        var bpc2 = null;
                        var bpc3 = null;
                        this.createBillingProviderConfiguration("braintree", {
                            "environment": "SANDBOX",
                            "merchantId": "",
                            "publicKey": "",
                            "privateKey": ""
                        }).then(function() {
                            bpc1 = this;
                        });
                        this.createBillingProviderConfiguration("braintree", {
                            "environment": "SANDBOX",
                            "merchantId": "",
                            "publicKey": "",
                            "privateKey": ""
                        }).then(function() {
                            bpc2 = this;
                        });
                        this.createBillingProviderConfiguration("braintree", {
                            "environment": "SANDBOX",
                            "merchantId": "",
                            "publicKey": "",
                            "privateKey": ""
                        }).then(function() {
                            bpc3 = this;
                        });

                        this.then(function()
                        {
                            // list (should find 3)
                            this.listBillingProviderConfigurations().count(function(count) {
                                equal(count, 3, "Found 3 billing providers");
                            });

                            // read back and delete #3
                            this.readBillingProviderConfiguration(bpc3.getId()).del();

                            // query for all SANDBOX environments, should be 2 now
                            this.queryBillingProviderConfigurations({
                                "environment": "SANDBOX"
                            }).count(function(count) {
                                equal(count, 2, "Queried and found 2 BPCs");
                            });

                            // sanity check
                            this.queryBillingProviderConfigurations({
                                "environment": "BLAH"
                            }).count(function(count) {
                                equal(count, 0, "Found no dummies (good)");
                            });

                            this.then(function() {
                                success();
                            });

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
