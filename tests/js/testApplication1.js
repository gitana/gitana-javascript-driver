(function($) {

    module("application1");

    // Test case : Application 1
    _asyncTest("Application 1", function()
    {
        expect(3);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            var title = "snap-" + new Date().getTime();
            var key   = "key-" + new Date().getTime();

            var originalCount = -1;
            this.listApplications({
                "limit": -1
            }).count(function(count) {
                originalCount = count;
            });

            var application = null;
            this.createApplication({
                "title": title,
                "key": key
            }).then(function() {
                application = this;
            });
            this.listApplications({
                "limit": -1
            }).count(function(count) {
                equal(count, originalCount + 1, "Application count + 1");
            });

            // test query
            this.queryApplications({"key": key}).count(function(count) {
                equal(count, 1, "Found a query result");
            });

            // update and delete the application
            this.then(function() {

                this.readApplication(application.getId()).update().del();

                this.listApplications({
                    "limit": -1
                }).count(function(count) {
                    equal(count, originalCount, "Application back to what it was");
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
