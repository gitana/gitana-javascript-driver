(function($) {

    module("persongroup");

    // Test case : Person and Group Nodes
    test("Person and Group Nodes", function() {

        stop();

        expect(1);

        var driver = new Gitana.Driver();

        var setupHandler1 = function(status)
        {
            // read the repository back
            driver.repositories().read(status.getId(), setupHandler2);
        };

        var setupHandler2 = function(repository)
        {
            var _this = this;

            this.repository = repository;

            // read the master branch
            this.repository.branches().read("master", function(branch) {

                _this.branch = branch;

                usersAndGroups();
            });
        };

        var usersAndGroups = function()
        {
            var _this = this;

            // create a new user
            var userId = "test-" + new Date().getTime();
            driver.users().create(userId, {"title":"Bob Jones"}, function() {

                // read back user
                driver.users().read(userId, function(user) {

                    _this.user = user;

                    // create a new group
                    var groupId = "group-" + new Date().getTime();
                    driver.groups().create(groupId, {"title":"University of Wisconsin"}, function(group) {

                        _this.group = group;

                        driver.groups().read(groupId, function(group) {

                            _this.group = group;

                            defineAssociation();

                        });
                    });
                });
            });
        };

        var defineAssociation = function()
        {
            // define a new association type
            var obj = {
                "_qname":"custom:attended",
                "_type":"d:association",
                "type":"object",
                "description":"ATTENDED",
                "properties":{}
            };
            this.branch.nodes().create(obj, function(status) {

                test1();

            });
        };

        var test1 = function()
        {
            var _this = this;

            // retrieve the security user's person node
            _this.branch.nodes().readPerson(_this.user.getPrincipalId(), true, function(personNode) {

                _this.personNode = personNode;

                // retrieve the security group's group noe
                _this.branch.nodes().readGroup(_this.group.getPrincipalId(), true, function(groupNode) {

                    _this.groupNode = groupNode;

                    // link them together through the "custom:attended" association
                    _this.personNode.associate(_this.groupNode, "custom:attended", function() {

                        // now verify that one can see the other through a traversal

                        _this.personNode.traverse({"depth":1}, function(response) {

                            ok(response.nodeMap[_this.groupNode.getId()], "Should have found group node as depth 1 association");

                            success();
                        });
                    });
                });
            });
        };

        var success = function() {
            start();
        };

        // kick off the test after logging in
        driver.security().authenticate("admin", "admin", function() {
            driver.repositories().create(setupHandler1);
        });

    });

}(jQuery) );
