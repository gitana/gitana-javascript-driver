(function($) {

    module("repository3");

    // Test case : Repository pagination
    _asyncTest("Repository Pagination", function()
    {
        expect(7);

        var pokey = "pokey_" + new Date().getTime();

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            // create four repositories
            this.createRepository({"pokey": pokey, "title": "abc"});
            this.createRepository({"pokey": pokey, "title": "def"});
            this.createRepository({"pokey": pokey, "title": "ghi"});
            this.createRepository({"pokey": pokey, "title": "jkl"});

            // query for all repositories with our pokey tag
            this.queryRepositories({"pokey": pokey}).count(function(count) {
                equal(count, 4, "Pokey count is 4");
            });

            // paginate, skip=2, count=2
            this.queryRepositories({"pokey": pokey}, {"skip": 2}).count(function(count) {
                equal(count, 2, "Paginate 1 returns count = 2");
            });

            // paginate, skip=0, count=3
            this.queryRepositories({"pokey": pokey}, {"skip": 0, "limit": 3}).count(function(count) {
                equal(count, 3, "Paginate 2 returns count = 3");
            });

            // now list all repositories with pagination
            var index = 0;
            this.listRepositories({
                "sort": {
                    "title": 1
                },
                "limit": -1
            }).each(function() {

                if (this.get("pokey") == pokey)
                {
                    if (index == 0)
                    {
                        equal("abc", this.get("title"), "ABC");
                    }
                    else if (index == 1)
                    {
                        equal("def", this.get("title"), "DEF");
                    }
                    else if (index == 2)
                    {
                        equal("ghi", this.get("title"), "GHI");
                    }
                    else if (index == 3)
                    {
                        equal("jkl", this.get("title"), "JKL");
                    }

                    index++;
                }

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
