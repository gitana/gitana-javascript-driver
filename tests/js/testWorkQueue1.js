(function($) {

    module("workQueue1");

    var OPERATION_COUNT = 10;

    // only allow 3 concurrent work items at a time
    Gitana.HTTP_WORK_QUEUE_SIZE = 3;

    // Test case : Work Queue
    _asyncTest("Work Queue tests", function()
    {
        expect(1);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // fire off 8 parallel node creates
            var factory = function(index) {
                return function() {
                    this.createNode();
                }
            };
            var fns = [];
            for (var i = 0; i < OPERATION_COUNT; i++)
            {
                fns.push(factory(i));
            }
            this.then(fns).then(function() {
                ok(true, "Completed test");
            });
            this.then(function() {
                success();
            });

        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
