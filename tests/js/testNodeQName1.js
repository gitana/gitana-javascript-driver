(function($) {

    module("nodeQName1");

    // Test case : Node QName 1
    test("Node QName 1", function() {

        stop();

        expect(3);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // create a node
            var node1 = null;
            this.createNode().then(function() {
                node1 = this;
            });

            // query to verify
            this.then(function() {
                this.queryNodes({
                    "_qname": node1.getQName()
                }).count(function(count) {
                    equal(1, count, "First - count was 1");
                });
            });

            // change the qname
            this.then(function() {
                this.subchain(node1).then(function() {
                    this.changeQName("custom:qname");
                });
            });

            // query to verify
            this.then(function() {
                this.queryNodes({
                    "_qname": node1.getQName()
                }).count(function(count) {
                    equal(0, count, "Second - count was 0");
                });
            });

            // query to verify
            this.then(function() {
                this.queryNodes({
                    "_qname": "custom:qname"
                }).count(function(count) {
                    equal(1, count, "Third - count was 1");
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
