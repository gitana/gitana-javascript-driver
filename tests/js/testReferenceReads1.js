(function($) {

    module("referenceReads1");

    // Test case : Reference Reads 1
    _asyncTest("Reference Reads 1", function()
    {
        expect(6);

        GitanaTest.authenticateFullOAuth().then(function() {

            var platform = this;

            // create a few things
            var repository = null;
            this.createRepository().then(function() {
                repository = this;
            });

            var domain = null;
            this.createDomain().then(function() {
                domain = this;
            });

            var registrar = null;
            this.createRegistrar().then(function() {
                registrar = this;
            });

            var stack = null;
            this.createStack().then(function() {
                stack = this;
            });

            var team = null;
            this.then(function() {
                this.subchain(stack).createTeam("abc-" + new Date().getTime()).then(function() {
                    team = this;
                });
            });

            this.then(function() {

                var repositoryReference = "repository://" + platform.getId() + "/" + repository.getId();
                var domainReference = "domain://" + platform.getId() + "/" + domain.getId();
                var registrarReference = "registrar://" + platform.getId() + "/" + registrar.getId();
                var stackReference = "stack://" + platform.getId() + "/" + stack.getId();
                var teamReference = "team://stack/" + platform.getId() + "/" + stack.getId() + "/" + team.getKey();

                var entries = [{
                    "ref": repositoryReference
                }, {
                    "ref": domainReference
                }, {
                    "ref": registrarReference
                }, {
                    "ref": stackReference
                }, {
                    "ref": teamReference
                }];

                this.referenceReads(entries, function(results) {

                    // check that they all came back
                    ok(results.length == entries.length, "Found the right number of results");

                    for (var i = 0; i < results.length; i++)
                    {
                        ok(results[i].entry, "Found entry #" + i);
                    }

                    // done
                    start();
                });
            });
        });
    });

}(jQuery) );
