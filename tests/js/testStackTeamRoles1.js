(function($) {

    module("stackTeamRoles1");

    // Test case : Stack team roles #1
    _asyncTest("Stack Team Roles #1", function()
    {
        expect(9);

        GitanaTest.authenticateFullOAuth().then(function() {

            // NOTE: this = platform

            // create a domain
            var domain = null;
            this.createDomain().then(function() {
                domain = this;
            });

            // create a repository
            var repository = null;
            this.createRepository().then(function() {
                repository = this;
            });

            // create a stack
            var stack = null;
            this.createStack().then(function() {
                stack = this;
            });

            // create a user in the domain
            var user = null;
            this.then(function() {

                this.subchain(domain).createUser({
                    "name": "joe"
                }).then(function() {
                    user = this;
                });
            });

            // set up stack and team
            this.then(function() {

                // associate both domain and repository to stack
                this.subchain(stack).assignDataStore(domain);
                this.subchain(stack).assignDataStore(repository);

                // create a role on the stack "xyz" which grants "MODIFY_CREDENTIALS"
                this.subchain(stack).createRole("xyz", {
                    "permissions": ["MODIFY_CREDENTIALS"]
                });

                // create a team "abc" on the stack which bestows the "xyz" role
                this.subchain(stack).createTeam("abc").then(function() {
                    this.grant("xyz");
                });
            });

            // FIRST CASE: ensure the user doesn't have authorities against the domain, stack and repository
            this.then(function() {
                this.subchain(stack).checkAuthority(user, "xyz", function(result) {
                    ok(!result, "Check authority #1 for stack: false");
                });
                this.subchain(domain).checkAuthority(user, "xyz", function(result) {
                    ok(!result, "Check authority #1 for domain: false");
                });
                this.subchain(repository).checkAuthority(user, "xyz", function(result) {
                    ok(!result, "Check authority #1 for repository: false");
                });
            });

            // assign user to the team
            this.then(function() {
                this.subchain(stack).readTeam("abc").addMember(user);
            });

            // SECOND CASE: ensure the user now does have authorities
            this.then(function() {
                this.subchain(stack).checkAuthority(user, "xyz", function(result) {
                    ok(result, "Check authority #2 for stack: true");
                });
                this.subchain(domain).checkAuthority(user, "xyz", function(result) {
                    ok(result, "Check authority #2 for domain: true");
                });
                this.subchain(repository).checkAuthority(user, "xyz", function(result) {
                    ok(result, "Check authority #2 for repository: true");
                });
            });

            // remove user from the team
            this.then(function() {
                this.subchain(stack).readTeam("abc").removeMember(user);
            });

            // THIRD CASE: ensure the user doesn't have authorities against the domain, stack and repository
            this.then(function() {
                this.subchain(stack).checkAuthority(user, "xyz", function(result) {
                    ok(!result, "Check authority #3 for stack: false");
                });
                this.subchain(domain).checkAuthority(user, "xyz", function(result) {
                    ok(!result, "Check authority #3 for domain: false");
                });
                this.subchain(repository).checkAuthority(user, "xyz", function(result) {
                    ok(!result, "Check authority #3 for repository: false");
                });
            });

            // all done
            this.then(function() {
                start();
            });
        });

        var success = function()
        {
            start();
        };
    });

}(jQuery) );
