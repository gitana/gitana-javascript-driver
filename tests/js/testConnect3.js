(function() {

    module("connect3");

    /**
     * Ensures that projects and stacks are accessible from app helper.
     */

    // Test case : Gitana Connect #3
    _asyncTest("Gitana Connect #3", function()
    {
        expect(2);

        var appKey = "app-" + new Date().getTime();

        var f1 = function()
        {
            // use the connect() method to take advantage of Gitana's automatic connection loading
            // this will sign on anew and pre-load information for the given stack
            // if a "key" is provided, the driver is cached
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_KEY,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                "username": "admin",
                "password": "admin",
                "application": appKey,
                "invalidatePlatformCache": true
            }, function(err) {

                // this = app helper

                ok(this.project(), "Found project");
                ok(this.stack(), "Found stack");

                start();
            });
        };

        // create stack + some data stores and things
        GitanaTest.authenticateFullOAuth().then(function() {

            // this == platform

            // create project
            // this comes with a stack
            var projectId = null;
            this.createProject({
                "title": "Sample Project",
                "family": "oneteam"
            }).then(function() {
                projectId = this.getId();
            });

            this.then(function() {

                // create application
                // this auto-associates the application to the project stack
                this.createApplication({
                    "key": appKey,
                    "projectId": projectId
                });

            });

            this.then(function() {

                this.logout().then(function() {
                    f1();
                });
            });

        });

    });

}());
