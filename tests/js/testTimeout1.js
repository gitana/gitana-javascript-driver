(function() {

    module("timeout1");

    // Test case : Timeout 1
    _asyncTest("Timeout 1", function()
    {
        expect(2);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            Gitana.HTTP_TIMEOUT = 10; // 10 milliseconds
            Gitana.HTTP_TIMEOUT_FN = function(xhr, method, url) {
                ok(true, "Timeout callback was fired, method: " + method + ", url:" + url);
            };

            // make any call and we expect it to timeout
            this.trap(function(e) {
                ok(true, "Trap handler called: " + JSON.stringify(e));
                success();
                return false;
            }).listApplications();
        });

        var success = function()
        {
            start();
        };

    });

}());
