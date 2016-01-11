(function() {

    module("nodeKeepOneError1");

    // Test case : Node keep one empty set proper error handling
    _asyncTest("nodeKeepOneError1", function()
    {
        expect(1);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch
            var branch = this;

            // query for empty set
            this.subchain(branch).trap(function(e) {

                ok(true, "Error handler ran successfully");

                success();
                return false;

            }).queryNodes({
                "abdbasd": "ASDADS"
            }).keepOne().then(function() {

                // should never get here
                ok(false, "Should never get here");

            });
        });

        var success = function()
        {
            start();
        };

    });

}() );
