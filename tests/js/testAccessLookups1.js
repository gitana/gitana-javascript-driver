(function($) {

    module("accessLookups1");

    // Test case : Access Lookups 1
    test("Access Lookups 1", function()
    {
        stop();

        expect(6);

        GitanaTest.authenticateFullOAuth().then(function() {

            var authInfo = this.getDriver().getAuthInfo();
            var principalId = authInfo.getPrincipalDomainId() + "/" + authInfo.getPrincipalId();

            // NOTE: this = platform
            var platform = this;

            // create a few things
            var repository = null;
            this.createRepository().then(function() {
                repository = this;
            });

            var domain = null;
            this.createDomain().then(function() {
                domain = this;
            });

            var registrar = null;
            this.createRegistrar().then(function() {
                registrar = this;
            });

            this.then(function() {

                var repositoryReference = "repository://" + platform.getId() + "/" + repository.getId();
                var domainReference = "domain://" + platform.getId() + "/" + domain.getId();
                var registrarReference = "registrar://" + platform.getId() + "/" + registrar.getId();

                var entries = [{
                    "permissioned": repositoryReference,
                    "principalId": principalId
                }, {
                    "permissioned": domainReference,
                    "principalId": principalId
                }, {
                    "permissioned": registrarReference,
                    "principalId": principalId
                }];

                this.accessLookups(entries, function(results) {

                    var f = function(reference)
                    {
                        var result = null;

                        for (var i = 0; i < results.length; i++)
                        {
                            if (results[i].permissioned == reference)
                            {
                                result = results[i];
                                break;
                            }
                        }

                        return result;
                    };

                    var repositoryResults = f(repositoryReference);
                    ok(repositoryResults.authorities.length > 1, "Found repository authorities");
                    ok(repositoryResults.permissions.length > 1, "Found repository permissions");

                    var domainResults = f(domainReference);
                    ok(domainResults.authorities.length > 1, "Found domain authorities");
                    ok(domainResults.permissions.length > 1, "Found domain permissions");

                    var registrarResults = f(registrarReference);
                    ok(registrarResults.authorities.length > 1, "Found registrar authorities");
                    ok(registrarResults.permissions.length > 1, "Found registrar permissions");

                    // done
                    start();
                });
            });
        });
    });

}(jQuery) );
