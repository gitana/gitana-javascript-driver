(function($) {

    module("referenceAccessChecks");

    // Test case : Reference Access Checks 1
    _asyncTest("Reference Access Checks 1", function()
    {
        expect(3);

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
                    "principalId": principalId,
                    "authorityId": "connector"
                }, {
                    "permissioned": domainReference,
                    "principalId": principalId,
                    "permissionId": "UPDATE"
                }, {
                    "permissioned": registrarReference,
                    "principalId": principalId,
                    "authorityId": "owner"
                }];

                this.accessChecks(entries, function(results) {

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
                    ok(repositoryResults.hasAuthority, "Repository - has 'connector' authority");

                    var domainResults = f(domainReference);
                    ok(domainResults.hasPermission, "Domain - has 'UPDATE' permission");

                    var registrarResults = f(registrarReference);
                    ok(registrarResults.hasAuthority, "Registrar - has 'owner' authority");

                    // done
                    start();
                });
            });
        });
    });

}(jQuery) );
