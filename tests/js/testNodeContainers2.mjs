import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("nodeContainers2", function() {

    it("Node Containers #2", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(2);

        return guard(t, function(start) {
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

                                    t.assert.ok(this.title == newTitle, "title matches");
                                    t.assert.ok(this.description == "Booya", "description matches");

                                    start();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
