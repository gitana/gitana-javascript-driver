(function($) {

    module("nodeContainers1");

    // Test case : Node Containers
    test("Node Containers", function() {

        stop();

        expect(1);

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").createRepository().readBranch("master").then(function() {

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
