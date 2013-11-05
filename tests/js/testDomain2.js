(function($) {

    module("domain2");

    // Test case : Domain Map operations
    _asyncTest("Domain Map operations", function()
    {
        expect(5);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            var segment = "segment-" + new Date().getTime();

            // create 3 domains
            this.createDomain({"segment": segment});
            this.createDomain({"segment": segment});
            this.createDomain({"segment": segment});

            // query domains
            var total = 0;
            this.queryDomains({"segment": segment}, {"limit": 2, "skip": 1}).each(function() {
                total++;
            }).totalRows(function(totalRows) {
                equal(totalRows, 3, "Found total rows == 3"); // total rows == 1
            }).size(function(size) {
                equal(size, 2, "Found size == 2")
            }).offset(function(offset) {
                equal(offset, 1, "Found offset == 1"); // offset == 0
            }).count(function(count) {
                equal(count, 2, "Found count == 2");
            }).then(function() {
                equal(2, total, "Map has total of 2");
                start();
            });
        });
    });

}(jQuery) );
