(function($) {

    module("nodePersonGroup1");

    // Test case : Person and Group Nodes
    test("Person and Group Nodes", function()
    {
        stop();

        expect(6);

        var userId = "test-" + new Date().getTime();
        var groupId = "group-" + new Date().getTime();

        var associationDefinitionObject = {
            "_qname":"custom:attended",
            "_type":"d:association",
            "type":"object",
            "description":"ATTENDED",
            "properties":{}
        };

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").then(function() {

            // NOTE: this = server

            // create user and group
            var user;
            this.createUser(userId, {"title":"Bob Jones"}).then(function() {
                user = this;
            });
            this.createGroup(groupId, {"title":"University of Wisconsin"});

            // crete branch and read back branch
            this.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch
                var branch = this;

                // define association
                this.createNode(associationDefinitionObject);

                // ensure person node
                var person = null;
                this.readPerson(userId, true).then(function() {
                    person = this;
                });

                // ensure group node
                var group = null;
                this.readGroup(groupId, true).then(function() {
                    group = this;
                });

                // ensure that we can get the user from the person
                this.then(function() {
                    this.subchain(person).readUser().then(function() {
                        ok(true, "Loaded user from person");
                        equal(this.getPrincipalId(), person.getUserId(), "Principal ID and User ID match");
                    });
                });

                // ensure that we can also get the person from the user
                this.then(function() {
                    this.subchain(user).readPerson(branch).then(function() {
                        ok(true, "Loaded person from user");
                        equal(user.getPrincipalId(), this.getUserId(), "Principal ID and User ID match");
                    });
                });

                // and then...
                this.then(function() {

                    // associate
                    this.subchain(person).associate(group, "custom:attended").then(function() {

                        // NOTE: this = person

                        // now verify that the person can see the group through traversal
                        this.traverse({"depth":1}).then(function() {

                            // NOTE: this = traversal results

                            this.node(group.getId()).then(function() {
                                equal(this.getId(), group.getId(), "Found group node as depth 1 association");
                            });

                            var bail = function()
                            {
                                ok(true, "Correctly fired bail handler");
                                success();
                            };

                            // now intentionally fail a look up to ensure this is working
                            this.trap(bail).node("shakazulu").then(function() {
                                ok(false, "Should not have arrived here");
                            });

                        });
                    });
                });

            });
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
