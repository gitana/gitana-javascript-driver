(function($) {

    module("chainable2");

    // Test case : Chainable 2
    test("Chainable 2", function()
    {
        stop();

        expect(10);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().then(function() {

            // NOTE: this = repository

            // create 8 branches in serial
            this.createBranch("0:root");
            this.createBranch("0:root");
            this.createBranch("0:root");
            this.createBranch("0:root");
            this.createBranch("0:root");
            this.createBranch("0:root");
            this.createBranch("0:root");
            this.createBranch("0:root");

            // update all of the branches in serial each()
            var x = 0;
            this.listBranches().each(function() {

                // update branch
                var title = "branch-title-" + x++;
                this.object["title"] = title;

                this.update().then(function() {
                    equal(this.object["title"], title, "Title matched");
                });

            });

            // list all of the branches and test keepOne()
            this.listBranches().keepOne().then(function() {
                ok(this.objectType == "Gitana.Branch", "Found a single branch");
                success();
            });
        });

        var success = function()
        {
            start();
        }

    });

}(jQuery) );
