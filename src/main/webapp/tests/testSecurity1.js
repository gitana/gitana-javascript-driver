var testSecurity1 = function()
{
    var driver = new Gitana.Driver();

    var userCount = 0;
    var groupCount = 0;

    // retrieve number of users and groups
    var test0 = function()
    {
        var _this = this;

        driver.users().list(function(result)
        {
            _this.userCount = result.rows.length;

            driver.groups().list(function(result)
            {
                _this.groupCount = result.rows.length;

                test1();
            });
        });
    };

    // tests user create, read, list and delete
    var test1 = function()
    {
        var _this = this;

        // create a test user
        var userId1 = "user" + new Date().getTime();
        driver.users().create({"userId":userId1}, function(status)
        {
            driver.users().read(userId1, function(user1)
            {
                if (user1.getId() != userId1)
                {
                    alert("user 1 id did not match");
                }

                driver.users().list(function(result) {

                    if (result.rows.length != _this.userCount + 1)
                    {
                        alert("A) user rows: " + result.rows.length + " should be 1 greater than: " + _this.userCount);
                    }

                    driver.users().del(userId1, function(status)
                    {
                        driver.users().list(function(result) {

                            if (result.rows.length != _this.userCount)
                            {
                                alert("B) user rows: " + result.rows.length + " should be equal to: " + _this.userCount);
                            }

                            test2();

                        });
                    });
                })
            });
        });
    };

    // tests group create, read, list and delete
    var test2 = function()
    {
        var _this = this;

        // create a test group
        var groupId1 = "group" + new Date().getTime();
        driver.groups().create({"groupId":groupId1}, function(status)
        {
            driver.groups().read(groupId1, function(group1)
            {
                if (group1.getId() != groupId1)
                {
                    alert("group 1 id did not match");
                }

                driver.groups().list(function(result) {

                    if (result.rows.length != _this.groupCount + 1)
                    {
                        alert("A) group rows: " + result.rows.length + " should be 1 greater than: " + _this.groupCount);
                    }

                    driver.groups().del(groupId1, function(status)
                    {
                        driver.groups().list(function(result) {

                            if (result.rows.length != _this.groupCount)
                            {
                                alert("B) group rows: " + result.rows.length + " should be equal to: " + _this.groupCount);
                            }

                            success();

                        });
                    });
                })
            });
        });
    };

    var success = function()
    {
        alert("success");
    };

    // kick off the test after logging in
    driver.security().authenticate("admin", "admin", function() {
        test0();
    });

};
