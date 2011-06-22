(function($) {

    module("context1");

    // Test case : Gitana Context #1
    test("Gitana Context #1", function()
    {
        stop();

        expect(3);

        var gitana = new Gitana();

        var key = "abc" + new Date().getTime();

        gitana.authenticate("admin", "admin").createRepository({
            "key": key
        }).then(function() {

            // create a context
            Gitana.GitanaContext.create({
                "repository": {
                    "key": key
                },
                "branch": "master",
                "user": "admin",
                "password": "admin"
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
