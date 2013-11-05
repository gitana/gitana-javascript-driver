(function($) {

    module("platformUpdate1");

    // Test case : Platform update
    _asyncTest("Platform update", function()
    {
        expect(2);

        GitanaTest.authenticateNewTenant(function() {

            // NOTE: this = platform
            var platform = this;

            this.title = "MyPlatform1";
            this.abc = "def";

            this.update().reload().then(function() {

                ok(this.title == "MyPlatform1", "Correct platform title");
                ok(this.abc == "def", "Correct platform custom property");

                start();

            });

        });

    });

}(jQuery) );
