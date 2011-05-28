(function($) {

    module("security4");

    // Test case : User/Group Paginations
    test("User/Group Paginations", function()
    {
        stop();

        expect(7);

        var tag = "sec4_" + new Date().getTime();

        // user ids
        var userId1 = "user1_" + new Date().getTime();
        var userId2 = "user2_" + new Date().getTime();
        var userId3 = "user3_" + new Date().getTime();
        var userId4 = "user4_" + new Date().getTime();
        var userId5 = "user5_" + new Date().getTime();

        // group ids
        var groupId1 = "group1_" + new Date().getTime();
        var groupId2 = "group2_" + new Date().getTime();
        var groupId3 = "group3_" + new Date().getTime();

        // start
        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").then(function() {

            // NOTE: this = server

            // create five users
            this.createUser(userId1, {"tag": tag, "title": "abc"});
            this.createUser(userId2, {"tag": tag, "title": "def"});
            this.createUser(userId3, {"tag": tag, "title": "ghi"});
            this.createUser(userId4, {"tag": tag, "title": "jkl"});
            this.createUser(userId5, {"tag": tag, "title": "mno"});

            // create five groups
            this.createGroup(groupId1, {"tag": tag, "title": "pqr"});
            this.createGroup(groupId2, {"tag": tag, "title": "stu"});
            this.createGroup(groupId3, {"tag": tag, "title": "vwxyz"});

            // list users using pagination
            // collect ids from first page
            var ids1 = [];
            this.listUsers({"skip":0, "limit":3}).each(function() {
                ids1.push(this.getPrincipalId());
            });
            // walk through second page and check for duplicates
            var uniqueCount1 = 0;
            this.listUsers({"skip":3, "limit":3}).each(function() {
                var failed = false;
                for (var i = 0; i < ids1.length; i++)
                {
                    if (this.getPrincipalId() == ids1[i])
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
                ids2.push(this.getPrincipalId());
            });
            var uniqueCount2 = 0;
            this.listGroups({"skip":2, "limit":2}).each(function(count) {
                var failed = false;
                for (var i = 0; i < ids2.length; i++)
                {
                    if (this.getPrincipalId() == ids2[i])
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
