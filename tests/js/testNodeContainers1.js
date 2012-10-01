(function($) {

    module("nodeContainers1");

    // Test case : Node Containers
    test("Node Containers", function() {

        stop();

        expect(2);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // create a folder with some files in it
            var container = null;
            this.createContainer().then(function() {

                // NOTE: this = container
                container = this;

                // create five children
                this.createChild();
                this.createChild();
                this.createChild();
                this.createChild();
                this.createChild();
            });

            // create a sixth child using childOf()
            // NOTE: do this in a then() because it depends on "container"
            this.then(function() {
                this.createNode().childOf(container);

                // count the children of the container
                this.subchain(container).listChildren().count(function(count) {
                    equal(count, 6, "Found six children");
                });

                // count the children using relative lookup
                this.subchain(container).listRelatives({
                    "type": "a:child",
                    "direction": "OUTGOING"
                }).count(function(count) {
                    equal(count, 6, "Found six children using relative lookup");
                });
            });

            this.then(function() {
                success();
            });
        });

        var success = function() {
            start();
        };

    });

}(jQuery) );
