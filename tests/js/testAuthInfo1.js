(function($) {

    module("authInfo1");

    // Test case : Auth Info 1
    _asyncTest("Auth Info 1", function()
    {
        expect(5);

        // start
        var gitana = GitanaTest.authenticate("admin", "admin");
        gitana.then(function() {

            // NOTE: this = platform

            var authInfo = this.getDriver().getAuthInfo();

            // principal
            equal("default", authInfo.getPrincipalDomainId(), "Validated principal domain id value");
            equal("admin", authInfo.getPrincipalName(), "Validated principal name value");
            ok(authInfo.getPrincipalId(), "Validated principal id exists");

            // client
            equal("eb9bcf0b-050d-4931-a11b-2231be0fd168", authInfo.getClientId(), "Validate client key value");

            // tenant
            ok(authInfo.getTenantId(), "Validated tenant id exists");
            //ok(authInfo.getTenantTitle(), "Validated tenant title exists");
            //ok(authInfo.getTenantDescription(), "Validated tenant description exists");

            this.then(function() {
                success();
            });

            var success = function()
            {
                start();
            };
        });
    });

}(jQuery) );
