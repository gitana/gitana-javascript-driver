(function($) {

    module("nodeMap1");

    // Test case : Node Map 1
    test("Node Map 1", function() {

        stop();

        expect(9);

        var gitana = new Gitana();
        gitana.authenticate("admin", "admin").createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // create some nodes
            this.createNode({"value": 0});
            this.createNode({"value": 1});
            this.createNode({"value": 2});
            this.createNode({"value": 3});
            this.createNode({"value": 4});
            this.createNode({"value": 5});
            this.createNode({"value": 6});
            this.createNode({"value": 7});
            this.createNode({"value": 8});
            this.createNode({"value": 9});


            // query for nodes and filter by value > 5
            this.queryNodes().filter(function() {
                return (this.get("value") > 5)
            }).count(function(count) {
                equal(count, 4, "Count was 4");
            });


            // query for nodes and filter for even values
            this.queryNodes().filter(function() {
                return (this.get("value") % 2 == 0);
            }).count(function(count) {
                equal(count, 5, "Count was 5");
            });


            // query for nodes and filter for odd values
            var counter = 0;
            this.queryNodes().filter(function() {
                return (this.get("value") % 2 == 1);
            }).each(function() {
                counter++;
            });
            this.then(function() {
                equal(counter, 5, "Odd value count was 5");
            });


            // query for nodes, filter for even values and then sum up via each
            var sum = 0;
            this.queryNodes().filter(function() {
                return (this.get("value") % 2 == 0);
            }).count(function(count) {
                equal(count, 5, "Count was 5");
            }).each(function() {
                sum += this.get("value");
            });
            this.then(function() {
                equal(sum, 20, "Sum was 20");
            });

            // query for nodes and keep the result set thin (rows only, no values)
            // ensure we don't get any value back
            this.queryNodes({}, {"full":false}).then(function() {
                ok(!this.object.rows[0].value);
                ok(this.object.rows[0]["_doc"]);
            });


            // define a new type
            var contentType = {
                "_qname": "custom:knopfler1",
                "_type": "d:type"
            };
            this.createNode(contentType);

            // perform a filter over definitions
            var count1 = 0;
            var count2 = 0;
            this.listDefinitions("type").count(function(count) {
                count1 = count;
            });
            this.listDefinitions("type").filter(function() {
                return (this.get('_parent') == 'n:node' && this.getQName().substr(0, 2) != 'n:');
            }).each(function() {
                count2++;
            });
            this.then(function() {
                ok(count2 < count1, "Count2 = " + count2 + " is less than Count1: " + count1);
                equals(count2, 1, "Count2 = 1");
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
