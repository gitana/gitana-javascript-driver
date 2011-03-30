var testSecurity2 = function()
{
    var driver = new Gitana.Driver();

    var userCount = 0;
    var groupCount = 0;

    // retrieve number of users and groups
    var setup0 = function()
    {
        var _this = this;

        driver.users().list(function(result)
        {
            _this.userCount = result.rows.length;

            driver.groups().list(function(result)
            {
                _this.groupCount = result.rows.length;

                setup1();
            });
        });
    };

    var setup1 = function()
    {
        var _this = this;

        // create six users

        // 1
        _this.userId1 = "user" + new Date().getTime();
        driver.users().create({"userId":_this.userId1}, function(status)
        {
            // 2
            _this.userId2 = "user" + new Date().getTime();
            driver.users().create({"userId":_this.userId2}, function(status)
            {
                // 3
                _this.userId3 = "user" + new Date().getTime();
                driver.users().create({"userId":_this.userId3}, function(status)
                {
                    // 4
                    _this.userId4 = "user" + new Date().getTime();
                    driver.users().create({"userId":_this.userId4}, function(status)
                    {
                        // 5
                        _this.userId5 = "user" + new Date().getTime();
                        driver.users().create({"userId":_this.userId5}, function(status)
                        {
                            // 6
                            _this.userId6 = "user" + new Date().getTime();
                            driver.users().create({"userId":_this.userId6}, function(status)
                            {
                                setup2();
                            });
                        });
                    });
                });
            });
        });
    };

    var setup2 = function()
    {
        var _this = this;

        // create three groups

        // 1
        _this.groupId1 = "group" + new Date().getTime();
        driver.groups().create({"groupId":_this.groupId1}, function(status)
        {
            // 2
            _this.groupId2 = "group" + new Date().getTime();
            driver.groups().create({"groupId":_this.groupId2}, function(status)
            {
                // 3
                _this.groupId3 = "group" + new Date().getTime();
                driver.groups().create({"groupId":_this.groupId3}, function(status)
                {
                    setup3();
                });
            });
        });
    };

    var setup3 = function()
    {
        var _this = this;

        // read everything back
        driver.users().read(_this.userId1, function(u) {
            _this.user1 = u;

            driver.users().read(_this.userId2, function(u) {
                _this.user2 = u;

                driver.users().read(_this.userId3, function(u) {
                    _this.user3 = u;

                    driver.users().read(_this.userId4, function(u) {
                        _this.user4 = u;

                        driver.users().read(_this.userId5, function(u) {
                            _this.user5 = u;

                            driver.users().read(_this.userId6, function(u) {
                                _this.user6 = u;

                                driver.groups().read(_this.groupId1, function(g) {
                                    _this.group1 = g;

                                    driver.groups().read(_this.groupId2, function(g) {
                                        _this.group2 = g;

                                        driver.groups().read(_this.groupId3, function(g) {
                                            _this.group3 = g;

                                            test1();

                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    };

    var test1 = function()
    {
        var _this = this;

        // build out the following principal tree

        /**
         *    group1
         *       -> user1
         *       -> user2
         *    group2
         *       -> group3
         *             -> user 4
         *             -> user 5
         *             -> user 6
         *       -> user3
         */

        _this.group1.addUserMember(_this.userId1, function(status) {

            _this.group1.addUserMember(_this.userId2, function(status) {

                _this.group2.addGroupMember(_this.groupId3, function(status) {

                    _this.group2.addUserMember(_this.userId3, function(status) {

                        _this.group3.addUserMember(_this.userId4, function(status) {

                            _this.group3.addUserMember(_this.userId5, function(status) {

                                _this.group3.addUserMember(_this.userId6, function(status) {

                                    test2();

                                });
                            });
                        });
                    });
                });
            });
        });
    };

    var test2 = function()
    {
        var _this = this;

        // verify memberships
        _this.group1.getUserMembers(function(response) {

            if (response.rows.length != 2)
            {
                alert("A) length should be 2");
            }

            _this.group2.getGroupMembers(function(response) {

                if (response.rows.length != 1)
                {
                    alert("B) length should be 1");
                }

                _this.group2.getUserMembers(function(response) {

                    if (response.rows.length != 1)
                    {
                        alert("C) length should be 1");
                    }

                    _this.group3.getUserMembers(function(response) {

                        if (response.rows.length != 3)
                        {
                            alert("D) length should be 3");
                        }

                        test3();
                    });
                });
            });
        });
    };

    var test3 = function()
    {
        var _this = this;

        // remove a member from group 3 and validate
        _this.group3.removeUserMember(_this.userId6, function(status) {

            _this.group3.getUserMembers(function(response) {

                if (response.rows.length != 2)
                {
                    alert("E) length should be 2");
                }

                test4();
            });
        });
    };

    var test4 = function()
    {
        success();
    };

    var success = function()
    {
        alert("success");
    };

    // kick off the test after logging in
    driver.security().authenticate("admin", "admin", function() {
        setup0();
    });

};
