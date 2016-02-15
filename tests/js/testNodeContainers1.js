(function($) {

    module("nodeContainers1");

    // Test case : Node Containers
    _asyncTest("Node Containers", function()
    {
        expect(5);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            var rootNode = null;
            this.rootNode().then(function() {
                rootNode = this;
            });

            this.then(function() {

                // create a folder with some files in it
                var container = null;
                this.createContainer().then(function() {

                    // NOTE: this = container
                    container = this;

                    // connect it to the root node
                    this.childOf(rootNode);

                    // check to make sure this has the "f:container" feature
                    this.hasFeature("f:container", function(hasContainer) {
                        ok(hasContainer, "Verified that container has the f:container feature");
                    });

                    // create five children
                    this.then(function() {
                        this.createChild();
                        this.createChild();
                        this.createChild();
                        this.createChild();
                        this.createChild();
                    });
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

                // create a container and then a child back to back
                this.createContainer({"title": "Test1"}).createChild({"title": "Test2"}).then(function() {
                    ok(this.getId(), "Found id for child node");
                    ok(true, "Created container + child back to back");
                });

                this.then(function() {
                    success();
                });

            });
        });

        var success = function() {
            start();
        };

    });

}(jQuery) );
