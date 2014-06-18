(function($) {

    module("report1");

    // Test case : Report 1
    _asyncTest("report1", function()
    {
        expect(2);

        GitanaTest.authenticateNewTenant(function() {

            // NOTE: this = platform
            var platform = this;

            this.createReport({
                "tag": "a"
            });
            this.createReport({
                "tag": "a"
            });
            var r = null;
            this.createReport({
                "tag": "b"
            }).then(function() {
                r = this;
            });

            this.listReports().count(function(count) {
                equal(count, 3, "Found three reports");
            });

            this.queryReports({
                "tag": "a"
            }).count(function(count) {
                equal(count, 2, "Found two reports");
            });

            this.subchain(r).then(function() {

                this.update().reload().del();

                this.then(function() {
                    start();
                });
            });
        });
    });

}(jQuery) );
