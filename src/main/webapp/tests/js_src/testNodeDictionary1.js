(function($) {

    module("nodeDictionary1");

    // Test case : Dictionary operations.
    test("Dictionary operations", function()
    {
        stop();

        expect(4);

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // list all definitions
            this.listDefinitions().count(function(count) {
                ok(count > 0, "Found definitions");
            });

            // list type definitions
            this.listDefinitions("type").count(function(count) {
                ok(count > 0, "Found type definitions");
            });

            // list association type definitions
            this.listDefinitions("association").count(function(count) {
                ok(count > 0, "Found association type definitions");
            });

            // list feature definitions
            this.listDefinitions("feature").count(function(count) {
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
