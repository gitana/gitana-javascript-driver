(function($) {

    module("domainPrincipal4");

    // Test case : Domain Principal 4
    // paginations, etc

    test("Domain Principal 4", function()
    {
        stop();

        expect(7);

        var tag = "sec4_" + new Date().getTime();

        // user names
        var userName1 = "user1_" + new Date().getTime();
        var userName2 = "user2_" + new Date().getTime();
        var userName3 = "user3_" + new Date().getTime();
        var userName4 = "user4_" + new Date().getTime();
        var userName5 = "user5_" + new Date().getTime();

        // group names
        var groupName1 = "group1_" + new Date().getTime();
        var groupName2 = "group2_" + new Date().getTime();
        var groupName3 = "group3_" + new Date().getTime();

        // start
        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.readDefaultDomain().then(function() {

            // NOTE: this = domain

            // create five users
            this.createUser({
                "name": userName1,
                "tag": tag,
                "title": "abc"
            });
            this.createUser({
                "name": userName2,
                "tag": tag,
                "title": "def"
            });
            this.createUser({
                "name": userName3,
                "tag": tag,
                "title": "ghi"
            });
            this.createUser({
                "name": userName4,
                "tag": tag,
                "title": "jkl"
            });
            this.createUser({
                "name": userName5,
                "tag": tag,
                "title": "mno"
            });

            // create five groups
            this.createGroup({
                "name": groupName1,
                "tag": tag,
                "title": "pqr"
            });
            this.createGroup({
                "name": groupName2,
                "tag": tag,
                "title": "stu"
            });
            this.createGroup({
                "name": groupName3,
                "tag": tag,
                "title": "vwxyz"
            });

            // list users using pagination
            // collect ids from first page
            var ids1 = [];
            this.listUsers({"skip":0, "limit":3}).each(function() {
                ids1.push(this.getId());
            });
            // walk through second page and check for duplicates
            var uniqueCount1 = 0;
            this.listUsers({"skip":3, "limit":3}).each(function() {
                var failed = false;
                for (var i = 0; i < ids1.length; i++)
                {
                    if (this.getId() == ids1[i])
                    {
                        failed = true;
                    }
                }
                if (!failed)
                {
                    uniqueCount1++;
                }
            }).then(function() {
                equal(uniqueCount1, 3, "Unique Count 1 passed");
            });

            // list groups using pagination
            var ids2 = [];
            this.listGroups({"skip":0, "limit":2}).each(function() {
                ids2.push(this.getId());
            });
            var uniqueCount2 = 0;
            this.listGroups({"skip":2, "limit":2}).each(function(count) {
                var failed = false;
                for (var i = 0; i < ids2.length; i++)
                {
                    if (this.getId() == ids2[i])
                    {
                        failed = true;
                    }
                }
                if (!failed)
                {
                    uniqueCount2++;
                }
            }).then(function() {
                equal(uniqueCount2, 2, "Unique Count 2 passed");
            });


            // test sorting of users on query
            var index = 0;
            this.listUsers({"sort":{"title": 1}}).each(function() {

                if (this.get("tag") == tag)
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
                    else if (index == 4)
                    {
                        equal("mno", this.get("title"), "MNO");
                    }

                    index++;
                }
            });

            this.then(function() {
                success();
            });

            var success = function()
            {
                start();
            };
        });
    });

}(jQuery) );
