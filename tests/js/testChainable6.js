(function($) {

    module("chainable6");

    // Test case : Chainable 6
    _asyncTest("Chainable 6", function()
    {
        expect(5);

        GitanaTest.authenticateFullOAuth().then(function() {

            this.createRepository().readBranch("master").then(function() {

                // create 5 nodes
                this.createNode({
                    "group": "abc"
                });
                this.createNode({
                    "group": "abc"
                });
                this.createNode({
                    "group": "abc"
                });
                this.createNode({
                    "group": "abc"
                });
                this.createNode({
                    "group": "abc"
                });


                // query for all the nodes
                // for each, set value = 1
                // then walk list and confirm
                this.queryNodes({
                    "group": "abc"
                }).each(function() {
                    this.value = 1;
                }).then(function() {

                    // flip to JSON and back
                    // this gets rid of any functions or prototype properties/methods
                    // now just a simple json object of key/value
                    var json = JSON.parse(JSON.stringify(this));
                    for (var k in json)
                    {
                        equal(json[k].value, 1, "Value was 1 for: " + k);
                    }

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
