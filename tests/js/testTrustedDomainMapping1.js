(function($) {

    module("trustedDomainMapping1");

    // Test case : Trusted Domain Mapping 1
    _asyncTest("Trusted Domain Mapping 1", function()
    {


        expect(2);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform
            var platformId = this.getId();

            // create a web host
            this.createWebHost().then(function() {

                // NOTE: this = web host

                // create a trusted domain mapping
                var id1 = null;
                this.createTrustedDomainMapping("abc.com", "webdav", platformId).then(function() {
                    id1 = this.getId();
                });
                var id2 = null;
                this.createTrustedDomainMapping("def.com", "webdav", platformId).then(function() {
                    id2 = this.getId();
                });
                var id3 = null;
                this.createTrustedDomainMapping("def.com", "ftp", platformId).then(function() {
                    id3 = this.getId();
                });

                this.then(function() {

                    this.listTrustedDomainMappings().count(function(count) {
                        equal(count, 3, "Found 3 trusted domain mappings");
                    });

                    // delete #3
                    this.readTrustedDomainMapping(id3).del();

                    this.listTrustedDomainMappings().count(function(count) {
                        equal(count, 2, "Found 2 trusted domain mappings");
                    });

                    this.then(function() {
                        success();
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
