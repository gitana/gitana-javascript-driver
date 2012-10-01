(function($) {

    module("warehouse1");

    // Test case : Warehouse 1
    test("Warehouse 1", function()
    {
        stop();

        expect(3);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            var title = "snap-" + new Date().getTime();
            var key   = "key-" + new Date().getTime();

            var originalCount = -1;
            this.listWarehouses().count(function(count) {
                originalCount = count;
            });

            var warehouse = null;
            this.createWarehouse({
                "title": title,
                "key": key
            }).then(function() {
                warehouse = this;
            });
            this.listWarehouses().count(function(count) {
                equal(count, originalCount + 1, "Warehouse count + 1");
            });

            // test query
            this.queryWarehouses({"key": key}).count(function(count) {
                equal(count, 1, "Found a query result");
            });

            // update and delete the warehouse
            this.then(function() {

                this.readWarehouse(warehouse.getId()).update().del();

                this.listWarehouses().count(function(count) {
                    equal(count, originalCount, "Warehouses back to what it was");
                });

                this.then(function() {
                    success();
                });

            });
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
