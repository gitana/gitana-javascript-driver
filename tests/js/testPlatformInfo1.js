(function($) {

    module("platformInfo1");

    // Test case : Platform info
    _asyncTest("Platform info", function() {


        expect(2);

        GitanaTest.authenticateFullOAuth().then(function() {

            // NOTE: this = platform

            this.createDomain();
            this.createRepository();

            this.loadInfo(function(object) {

                if (object["datastore_counts"])
                {
                    ok(true, "Found datastore_counts");

                    if (object["datastore_counts"]["domain"] > 0)
                    {
                        ok(true, "More than 1 domain");
                    }
                }

                start();
            });
        });

    });

}(jQuery) );
