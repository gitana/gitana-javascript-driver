(function($) {

    module("stackDataStores1");

    // Test case : Stack Data Stores
    test("Stack Data Stores 1", function()
    {
        stop();

        expect(6);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            // create two repositories
            var repo1 = null;
            this.createRepository({"abc":"123"}).then(function() {
                repo1 = this;
            });
            var repo2 = null;
            this.createRepository({"abc":"123", "def":"456"}).then(function() {
                repo2 = this;
            });

            // create a stack
            this.createStack().then(function() {

                // NOTE: this = stack

                // ensure zero data stores at onset
                this.listDataStores().count(function(count) {
                    equal(count, 0, "No data stores");
                });

                // assign a repository
                this.assignDataStore(repo1, "firstRepo");

                // should now be 1 data store
                this.listDataStores().count(function(count) {
                    equal(count, 1, "One repo");
                });

                // assign a repository
                this.assignDataStore(repo2, "secondRepo");

                // should now be 2 data stores
                this.listDataStores().count(function(count) {
                    equal(count, 2, "Two repos");
                });

                // query for repositories
                this.queryDataStores({"abc":"123"}).count(function(count) {
                    equal(count, 2, "Query #1 matched");
                });

                // query for repositories
                this.queryDataStores({"def":"456"}).count(function(count) {
                    equal(count, 1, "Query #2 matched");
                });

                // remove repo #2
                this.unassignDataStore("secondRepo");

                // should now be 1 data store
                this.listDataStores().count(function(count) {
                    equal(count, 1, "Back to one repo");
                });
            });

            this.then(function() {
                success();
            });

        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
