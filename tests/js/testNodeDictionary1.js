(function($) {

    module("nodeDictionary1");

    // Test case : Dictionary operations.
    _asyncTest("Dictionary operations", function()
    {
        expect(4);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // list all definitions
            this.listDefinitions({
                "limit": -1
            }).count(function(count) {
                ok(count > 0, "Found definitions");
            });

            // list type definitions
            this.listDefinitions("type", {
                "limit": -1
            }).count(function(count) {
                ok(count > 0, "Found type definitions");
            });

            // list association type definitions
            this.listDefinitions("association", {
                "limit": -1
            }).count(function(count) {
                ok(count > 0, "Found association type definitions");
            });

            // list feature definitions
            this.listDefinitions("feature", {
                "limit": -1
            }).count(function(count) {
                ok(count > 0, "Found feature definitions");
            });

            this.then(function() {
                success();
            });
        });

        var success = function() {
            start();
        };

    });

}(jQuery) );
