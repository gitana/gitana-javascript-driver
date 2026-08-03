import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("referenceAccessChecks", function() {

    it("Reference Access Checks 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(3);

        return guard(t, function(start) {
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
                        t.assert.ok(repositoryResults.hasAuthority, "Repository - has 'connector' authority");

                        var domainResults = f(domainReference);
                        t.assert.ok(domainResults.hasPermission, "Domain - has 'UPDATE' permission");

                        var registrarResults = f(registrarReference);
                        t.assert.ok(registrarResults.hasAuthority, "Registrar - has 'owner' authority");

                        // done
                        start();
                    });
                });
            });
        });
    });
});
