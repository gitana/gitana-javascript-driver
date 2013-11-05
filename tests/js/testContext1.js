(function($) {

    module("context1");

    // Test case : Gitana Context #1
    _asyncTest("Gitana Context #1", function()
    {


        expect(3);

        var key = "abc" + new Date().getTime();
        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository({
            "key": key
        }).then(function() {

            // create a context
            Gitana.Context.create({
                "repository": {
                    "key": key
                },
                "branch": "master",
                "driver": {
                    "clientKey": GitanaTest.TEST_CLIENT_KEY,
                    "clientSecret": GitanaTest.TEST_CLIENT_SECRET
                },
                "authentication": {
                    "username": "admin",
                    "password": "admin"
                }
            }).then(function() {

                ok(this.platform(), "Found platform");
                ok(this.repository(), "Found repository");
                ok(this.branch(), "Found branch");

                success();
            });

        });

        var success = function()
        {
            start();
        };
    });

}(jQuery) );
