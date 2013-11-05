(function($) {

    module("chainable5");

    // Test case : Chainable 5
    _asyncTest("Chainable 5", function()
    {
        expect(3);

        GitanaTest.authenticateFullOAuth().then(function() {

            this.createRepository().readBranch("master").then(function() {

                this.createNode({
                    "title": "My Title",
                    "description": "My Description",
                    "age": 21
                }).then(function() {

                    // convert the node to JSON and ensure that it converts cleanly
                    var json1 = JSON.stringify(this);
                    console.log("Node JSON -> " + json1);
                    var obj1 = JSON.parse(json1);

                    // should have 4 keys (title, description, age and _doc)
                    equal(Gitana.getNumberOfKeys(obj1), 4, "Found 4 keys");
                });

                // create two more nodes
                this.createNode({
                    "title": "My Title",
                    "description": "My Description",
                    "age": 21
                });
                this.createNode({
                    "title": "My Title",
                    "description": "My Description",
                    "age": 21
                });

                // query back nodes
                this.queryNodes({"age": 21}).then(function() {

                    // convert the node to JSON and ensure that it converts cleanly
                    var json2 = JSON.stringify(this);
                    console.log("Map JSON -> " + json2);
                    var obj2 = JSON.parse(json2);

                    // should only be three keys to the map (_doc1, _doc2, _doc3)
                    equal(Gitana.getNumberOfKeys(obj2), 3, "Found 3 _docs");

                    // convert to an array
                    var json3 = JSON.stringify(this.asArray());
                    console.log("Array JSON -> " + json3);
                    var array3 = JSON.parse(json3);

                    // should only be three rows in the array
                    equal(array3.length, 3, "Found 3 rows");

                    success();
                });

            });
        });

        var success = function()
        {
            start();
        }

    });

}(jQuery) );
