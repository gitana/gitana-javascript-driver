(function($) {

    module("domain2");

    // Test case : Domain Map operations
    test("Domain Map operations", function()
    {
        stop();

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
                equal(totalRows, 3, "Found total rows == 3");
            }).size(function(size) {
                equal(size, 2, "Found size == 2")
            }).offset(function(offset) {
                equal(offset, 1, "Found offset == 1");
            }).count(function(count) {
                equal(count, 2, "Found count == 2");
            }).then(function() {
                equal(2, total, "Map has total of 2");
                start();
            });
        });
    });

}(jQuery) );
