(function($) {

    module("containedTypes1");

    // Test case : Contained Types
    test("Contained Types", function()
    {
        stop();

        expect(1);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            this.subchain(this.getCluster()).loadContainedTypes("platform", function(list) {
                equals(16, list.length, "Found 16 contained dependencies for platform");

                start();
            });
        });
    });

}(jQuery) );
