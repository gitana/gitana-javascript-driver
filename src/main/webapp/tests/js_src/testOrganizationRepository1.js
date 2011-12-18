(function($) {

    module("organizationRepository1");

    // Test case : Organization Repository
    test("Organization Repository 1", function()
    {
        stop();

        expect(4);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = server

            // create two repositories
            var repo1 = null;
            this.createRepository().then(function() {
                repo1 = this;
            });
            var repo2 = null;
            this.createRepository().then(function() {
                repo2 = this;
            });

            // create an organization
            this.createOrganization().then(function() {

                this.reload().then(function() {
                    equals(this.getAssignedRepositoryIds().length, 0, "No repositories");
                });

                // assign a repository
                this.assignRepository(repo1.getId()).then(function() {

                    this.reload().then(function() {
                        equals(this.getAssignedRepositoryIds().length, 1, "One repository");
                    });

                    // assign a repository
                    this.assignRepository(repo2.getId()).then(function() {

                        this.reload().then(function() {
                            equals(this.getAssignedRepositoryIds().length, 2, "Two repositories");
                        });

                        // remove repository
                        this.unassignRepository(repo2.getId()).then(function() {

                            this.reload().then(function() {
                                equals(this.getAssignedRepositoryIds().length, 1, "Back to one repository");
                            });

                        });
                    });
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
