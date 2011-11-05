(function($) {

    module("organization1");

    // Test case : Organization
    test("Organization 1", function()
    {
        stop();

        expect(3);

        var test = this;

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").then(function() {

            // NOTE: this = server

            // create three users
            var user1 = null;
            var user2 = null;
            var user3 = null;
            this.createUser("user1-" + new Date().getTime()).then(function() {
                user1 = this;
            });
            this.createUser("user2-" + new Date().getTime()).then(function() {
                user2 = this;
            });
            this.createUser("user3-" + new Date().getTime()).then(function() {
                user3 = this;
            });

            var originalCount = -1;
            this.listOrganizations().count(function(count) {
                originalCount = count;
            });

            var organization = null;
            this.createOrganization({"title": "snap"}).then(function() {
                organization = this;
            });
            this.listOrganizations().count(function(count) {
                equal(count, originalCount + 1, "Organization count + 1");
            });

            // test query
            this.queryOrganizations({"title":"snap"}).count(function(count) {
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
