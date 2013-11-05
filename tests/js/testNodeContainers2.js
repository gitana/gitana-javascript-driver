(function($) {

    module("nodeContainers2");

    // Test case : Node Containers #2
    _asyncTest("Node Containers #2", function() {



        expect(2);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // create a nested folder
            this.createNode({
                "description": "Booya"
            }, {
                "filename": "{document.id}.txt",
                "folderPath": "/a/b/c/{document.id}"
            });

            this.then(function() {

                // query by path
                this.readNode("root", "/a/b/c").then(function() {

                    this.listChildren().then(function() {

                        this.keepOne().then(function() {

                            // THIS = the folder named {document.id}

                            this.listChildren().keepOne().then(function() {

                                var newTitle = this._doc + ".txt";

                                ok(this.title == newTitle, "title matches");
                                ok(this.description == "Booya", "description matches");

                                start();
                            });
                        });
                    });
                });
            });
        });
    });

}(jQuery) );
