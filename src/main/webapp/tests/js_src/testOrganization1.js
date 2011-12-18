(function($) {

    module("organization1");

    // Test case : Organization
    test("Organization 1", function()
    {
        stop();

        expect(3);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = server

            var title = "snap-" + new Date().getTime();

            var originalCount = -1;
            this.listOrganizations().count(function(count) {
                originalCount = count;
            });

            var organization = null;
            this.createOrganization({"title": title}).then(function() {
                organization = this;
            });
            this.listOrganizations().count(function(count) {
                equal(count, originalCount + 1, "Organization count + 1");
            });

            // test query
            this.queryOrganizations({"title": title}).count(function(count) {
                equal(count, 1, "Found a query result");
            });

            // update and delete the organization
            this.then(function() {

                this.readOrganization(organization.getId()).update().del();

                this.listOrganizations().count(function(count) {
                    equal(count, originalCount, "Organization back to what it was");
                });

                this.then(function() {
                    success();
                });

            });
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
