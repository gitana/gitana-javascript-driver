(function($) {

    module("conversionTrigger1");

    // Test case : Conversion Trigger 1
    //
    // Tests out user crud operations for conversion triggers
    //
    _asyncTest("Conversion Trigger 1", function()
    {
        expect(2);

        var platform = GitanaTest.authenticateFullOAuth();
        platform.createWarehouse().then(function() {

            // NOTE: this = warehouse

            var trigger = null;
            this.createConversionTrigger({
                "key": "zapConversion",
                "type": "action",
                "action": "zap"
            }).then(function() {
                trigger = this;
            });

            this.then(function() {

                // NOTE: this = warehouse

                this.listConversionTriggers().count(function(count) {
                    equal(1, count, "Found one conversion trigger on list");
                });

                this.queryConversionTriggers().count(function(count) {
                    equal(1, count, "Found one conversion trigger on query");
                });

                trigger.update();
                trigger.del();

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