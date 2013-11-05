(function($) {

    module("social1");

    // Test case : Basic Comment/Rating behavior
    _asyncTest("Basic Comment/Rating behavior", function()
    {
        expect(3);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch;

            var product = null;
            this.createNode().then(function() {
                product = this;
            });

            var object = {
                "_type": "n:comment",
                "rating": 3
            };
            var comment = null;
            this.createNode(object).then(function() {
                comment = this;
            });

            this.then(function() {

                // associate them
                this.subchain(product).then(function() {

                    // NOTE: this = product

                    this.associate(comment, "a:has_comment");
                    this.reload().then(function() {

                        var ratingTotalCount = this.stats()["ratingTotalCount"];
                        equals(ratingTotalCount, 1, "Total Count was 1");
                        var ratingTotalValue = this.stats()["ratingTotalValue"];
                        equals(ratingTotalValue, 3, "Total Value was 3");
                        var ratingAverageValue = this.stats()["ratingAverageValue"];
                        equals(ratingAverageValue, 3.0, "Average Value was 3");

                    });
                });
            });

            // success
            this.then(function() {
                success();
            });
        });

        var success = function() {
            start();
        };
    });

}(jQuery) );
