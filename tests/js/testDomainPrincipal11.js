(function($) {

    module("domainPrincipal11");

    // Test case : Domain Principal 11
    _asyncTest("Domain Principal 11", function()
    {
        expect(6);

        // user and three groups
        var userName1 = "user1_" + new Date().getTime();
        var groupName1 = "group1_" + new Date().getTime();
        var groupName2 = "group2_" + new Date().getTime();
        var groupName3 = "group3_" + new Date().getTime();
        var groupName4 = "group4_" + new Date().getTime();

        var propertyCount = function(obj)
        {
            var i = 0;

            for (var k in obj)
            {
                i++;
            }

            return i;
        };

        // start
        var platform = GitanaTest.authenticateFullOAuth();
        platform.createDomain().then(function() {

            // NOTE: this = domain

            // create user
            var user1 = null;
            this.createUser({
                "name": userName1,
                "p1": "v1"
            }).then(function() {
                user1 = this;
            });

            // create groups
            this.createGroup({
                "name": groupName1
            }).then(function() {
                this.addMember(user1);
            });
            this.createGroup({
                "name": groupName2
            }).then(function() {
                this.addMember(user1);
            });
            var g3 = null;
            this.createGroup({
                "name": groupName3
            }).then(function() {
                this.addMember(user1);
                g3 = this;
            });

            this.then(function() {

                this.createGroup({
                    "name": groupName4
                }).then(function() {
                    this.addMember(g3);
                });

            });

            this.then(function() {

                this.readPrincipal(user1.getId(), {
                    "groups": "direct"
                }).then(function() {

                    var _groups = this["_groups"];

                    ok(_groups, "Found direct _groups");
                    ok(propertyCount(_groups) == 3, "Found 3 direct _groups");
                });

                this.readPrincipal(user1.getId(), {
                    "groups": "indirect"
                }).then(function() {

                    var _groups = this["_groups"];

                    ok(_groups, "Found indirect _groups");
                    ok(propertyCount(_groups) === 4, "Found 4 indirect _groups");
                });

                var g1 = true;
                this.listPrincipals(null, {
                    "groups": "indirect"
                }).each(function() {
                    var _groups = this["_groups"];
                    g1 = g1 && _groups;
                }).then(function() {
                    ok(g1, "For list, all groups had _groups");
                });

                var g2 = true;
                this.queryPrincipals({
                    "p1": "v1"
                }, {
                    "groups": "indirect"
                }).each(function() {
                    var _groups = this["_groups"];
                        g2 = g2 && _groups;
                }).then(function() {
                    ok(g2, "For query, all groups had _groups");

                    success();
                });
            });

            var success = function()
            {
                start();
            };
        });
    });

}(jQuery) );
