(function($) {

    module("qname");
    // Test case : QName generation..
    test("QName generation.", function() {
        stop();

        expect(1);
        var driver = new Gitana.Driver();

        var repository = null;
        var branch = null;

        var setupHandler1 = function(status) {
            var _this = this;

            // read the repository back
            driver.repositories().read(status.getId(), function(_repository) {
                _this.repository = _repository;

                _this.repository.branches().read("master", function(_branch) {
                    _this.branch = _branch;

                    test1();
                });
            });
        };

        var test1 = function() {
            var _this = this;

            var object = {
                "title": "My First Title"
            };

            _this.branch.helpers().generateQName(object, function(qname) {

                equal (qname , "custom:myfirsttitle0", "QName should have been: custom:myfirsttitle0");

                success();
            });
        };

        var success = function() {
            start();
        };

        // kick off the test after logging in
        driver.security().authenticate("admin", "admin", function() {
            driver.repositories().create(setupHandler1);
        });

    });

}(jQuery) );
