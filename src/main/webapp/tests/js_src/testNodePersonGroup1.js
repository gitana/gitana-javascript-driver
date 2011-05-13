(function($) {

    module("nodePersonGroup1");

    // Test case : Person and Group Nodes
    test("Person and Group Nodes", function()
    {
        stop();

        expect(2);

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
            this.createUser(userId, {"title":"Bob Jones"});
            this.createGroup(groupId, {"title":"University of Wisconsin"});

            // crete branch and read back branch
            this.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch

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
