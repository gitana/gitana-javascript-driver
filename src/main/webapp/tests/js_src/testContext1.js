(function($) {

    module("context1");

    // Test case : Gitana Context #1
    test("Gitana Context #1", function()
    {
        stop();

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
                    "consumerKey": GitanaTest.TEST_CONSUMER_KEY,
                    "consumerSecret": GitanaTest.TEST_CONSUMER_SECRET
                },
                "authentication": {
                    "username": "admin",
                    "password": "admin"
                }
            }).then(function() {

                ok(this.server(), "Found server");
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
