(function($) {

    module("authInfo1");

    // Test case : Auth Info 1
    test("Auth Info 1", function()
    {
        stop();

        expect(5);

        // start
        var gitana = GitanaTest.opendriverAuthenticate("admin", "admin");
        gitana.then(function() {

            var authInfo = this.getDriver().getAuthInfo();

            // principal
            equal("default", authInfo.getPrincipalDomainId(), "Validated principal domain id value");
            equal("admin", authInfo.getPrincipalName(), "Validated principal name value");
            ok(authInfo.getPrincipalId(), "Validated principal id exists");

            // consumer
            equal("eb9bcf0b-050d-4931-a11b-2231be0fd168", authInfo.getConsumerKey(), "Validate consumer key value");

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
