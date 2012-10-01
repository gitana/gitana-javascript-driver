(function($) {

    module("autoClientMapping1");

    // Test case : Auto Client Mapping 1
    test("Auto Client Mapping 1", function()
    {
        stop();

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

            this.then(function() {

                // create a web host
                this.createWebHost().then(function() {

                    // NOTE: this = web host

                    // create an auto client mapping
                    this.createAutoClientMapping("http://x.y.com/z1", application, client);
                    this.createAutoClientMapping("http://x.y.com/z2", application, client);
                    var acm3 = null;
                    this.createAutoClientMapping("http://x.y.com/z3", application, client).then(function() {
                        acm3 = this;
                    });

                    this.then(function() {

                        this.listAutoClientMappings().count(function(count) {
                            equal(count, 3, "Found 3 auto client mappings");
                        });

                        // test query #1
                        this.queryAutoClientMappings({"clientKey": client.getKey()}).count(function(count) {
                            equal(count, 3, "Found 3 query results");
                        });

                        // test query #2
                        this.queryAutoClientMappings({"uri": "http://x.y.com/z1"}).count(function(count) {
                            equal(count, 1, "Found 1 query result");
                        });

                        // read back auto client mapping, update and delete
                        this.readAutoClientMapping(acm3.getId()).update().del();

                        this.listAutoClientMappings().count(function(count) {
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
