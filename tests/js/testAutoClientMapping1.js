(function($) {

    module("autoClientMapping1");

    // Test case : Auto Client Mapping 1
    _asyncTest("Auto Client Mapping 1", function()
    {
        expect(4);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            // create application
            var application = null;
            this.createApplication().then(function() {
                application = this;
            });

            // create client
            var client = null;
            this.createClient().then(function() {
                client = this;
            });

            // create authentication grant
            var authGrant = null;
            this.then(function() {
                this.createAuthenticationGrant({
                    "principalDomainId": "default",
                    "principalId": "guest",
                    "clientId": client.getKey()
                }).then(function() {
                    authGrant = this;
                });
            });

            this.then(function() {

                // create a web host
                this.createWebHost().then(function() {

                    // NOTE: this = web host

                    // create an auto client mapping
                    this.createAutoClientMapping("x1.y1.com", application, client, authGrant);
                    this.createAutoClientMapping("x2.y2.com", application, client, authGrant);
                    var acm3 = null;
                    this.createAutoClientMapping("x3.y3.com", application, client, authGrant).then(function() {
                        acm3 = this;
                    });

                    this.then(function() {

                        this.listAutoClientMappings({
                            "limit": -1
                        }).count(function(count) {
                            equal(count, 3, "Found 3 auto client mappings");
                        });

                        // test query #1
                        this.queryAutoClientMappings({"clientKey": client.getKey()}).count(function(count) {
                            equal(count, 3, "Found 3 query results");
                        });

                        // test query #2
                        this.queryAutoClientMappings({"host": "x1.y1.com"}).count(function(count) {
                            equal(count, 1, "Found 1 query result");
                        });

                        // read back auto client mapping + update and delete (chained direct)
                        this.readAutoClientMapping(acm3.getId()).update().del();

                        // list
                        this.listAutoClientMappings({
                            "limit": -1
                        }).count(function(count) {
                            equal(count, 2, "Auto Client Mapping now 2");
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
