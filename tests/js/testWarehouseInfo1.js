(function($) {

    module("warehouseInfo1");

    // Test case : Warehouse info
    _asyncTest("Warehouse info", function() {


        expect(1);

        GitanaTest.authenticateFullOAuth().then(function() {

            // NOTE: this = platform

            this.createWarehouse().loadInfo(function(object) {

                if (object["object_counts"])
                {
                    ok(true, "Found object_counts");
                    start();
                }
            });
        });

    });

}(jQuery) );
