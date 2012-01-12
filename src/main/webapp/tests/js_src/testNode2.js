(function($) {

    module("node2");

    // Test case : Node Statistics operations.
    test("Node statistics", function()
    {
        stop();

        expect(1);

        var test = this;

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // create a node
            this.createNode().then(function() {
                ok(this.get('stats') != null, "Node stats field generated");
            });

            this.then(function() {
                success();
            });

        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
