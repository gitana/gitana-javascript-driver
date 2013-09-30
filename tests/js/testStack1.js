(function($) {

    module("stack1");

    // Test case : Stack 1
    test("Stack 1", function()
    {
        stop();

        expect(3);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            var title = "snap-" + new Date().getTime();

            var originalCount = -1;
            this.listStacks({
                "limit": -1
            }).count(function(count) {
                originalCount = count;
            });

            var stack = null;
            this.createStack({"title": title}).then(function() {
                stack = this;
            });
            this.listStacks({
                "limit": -1
            }).count(function(count) {
                equal(count, originalCount + 1, "Stack count + 1");
            });

            // test query
            this.queryStacks({
                "title": title
            }, {
                "limit": -1
            }).count(function(count) {
                equal(count, 1, "Found a query result");
            });

            // update and delete the stack
            this.then(function() {

                this.readStack(stack.getId()).update().del();

                this.listStacks({
                    "limit": -1
                }).count(function(count) {
                    equal(count, originalCount, "Stack back to what it was");
                });

                this.then(function() {
                    success();
                });

            });
        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
