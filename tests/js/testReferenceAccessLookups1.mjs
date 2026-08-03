import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("referenceAccessLookups1", function() {

    it("Reference Access Lookups 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(6);

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
                        t.assert.ok(repositoryResults.authorities.length > 0, "Found repository authorities");
                        t.assert.ok(repositoryResults.permissions.length > 0, "Found repository permissions");

                        var domainResults = f(domainReference);
                        t.assert.ok(domainResults.authorities.length > 0, "Found domain authorities");
                        t.assert.ok(domainResults.permissions.length > 0, "Found domain permissions");

                        var registrarResults = f(registrarReference);
                        t.assert.ok(registrarResults.authorities.length > 0, "Found registrar authorities");
                        t.assert.ok(registrarResults.permissions.length > 0, "Found registrar permissions");

                        // done
                        start();
                    });
                });
            });
        });
    });
});
