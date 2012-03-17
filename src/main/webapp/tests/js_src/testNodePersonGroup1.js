(function($) {

    module("nodePersonGroup1");

    // Test case : Person and Group Nodes
    test("Person and Group Nodes", function()
    {
        stop();

        expect(6);

        var userName = "test-" + new Date().getTime();
        var groupName = "group-" + new Date().getTime();

        var associationDefinitionObject = {
            "_qname":"custom:attended",
            "_type":"d:association",
            "type":"object",
            "description":"ATTENDED",
            "properties":{}
        };

        var platform = GitanaTest.authenticateFullOAuth();
        platform.then(function() {

            // NOTE: this = platform

            // create user and group
            var domainUser;
            var domainGroup;
            this.readPrimaryDomain().then(function() {

                // NOTE: this = domain

                this.createUser({
                    "name": userName,
                    "title":"Bob Jones"
                }).then(function() {
                    domainUser = this;
                });
                this.createGroup({
                    "name": groupName,
                    "title": "University of Wisconsin"
                }).then(function() {
                    domainGroup = this;
                });
            });

            // crete branch and read back branch
            this.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch
                var branch = this;

                // define association
                this.createNode(associationDefinitionObject);

                // ensure person node
                var person = null;
                this.readPersonNode(domainUser, true).then(function() {
                    person = this;
                });

                // ensure group node
                var group = null;
                this.readGroupNode(domainGroup, true).then(function() {
                    group = this;
                });

                // ensure that we can get the user from the person
                this.then(function() {
                    this.subchain(person).readPrincipal().then(function() {
                        ok(true, "Loaded user from person");
                        equal(this.getId(), person.getPrincipalId(), "Principal ID and User ID match");
                    });
                });

                // ensure that we can also get the person from the user
                this.then(function() {
                    this.subchain(domainUser).readPersonNode(branch).then(function() {
                        ok(true, "Loaded person from user");
                        equal(domainUser.getId(), this.getPrincipalId(), "Principal ID and User ID match");
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
