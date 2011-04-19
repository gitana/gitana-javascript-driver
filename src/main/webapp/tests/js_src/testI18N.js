(function($) {

    module("i18n");
    // Test case : I18N.
    test("I18N", function() {
        stop();

        expect(6);
        var driver = new Gitana.Driver();

        var setupHandler1 = function(status) {
            ok(status.isOk(), "Create repository succeed.");
            // read the repository back
            driver.repositories().read(status.getId(), setupHandler2);
        };

        var setupHandler2 = function(repository) {
            var _this = this;

            this.repository = repository;

            // read the master branch
            this.repository.branches().read("master", function(branch) {

                _this.branch = branch;

                test1();
            });
        };

        var test1 = function() {
            var _this = this;

            var masterObject = {
                "title": "english1",
                "_features": {
                    "f:multilingual": {
                        "edition": "edition1"
                    }
                }
            };
            _this.branch.nodes().create(masterObject, function(status) {

                // read the master node back
                _this.branch.nodes().read(status.getId(), function(masterNode) {

                    // build a translation into german "edition1"
                    var german = { "title": "german1" };
                    masterNode.translations().create("edition1", "de_DE", german, function(germanTranslation) {

                        // build a translation into chinese "edition1"
                        var chinese = { "title": "chinese1" };
                        masterNode.translations().create("edition1", "zh_CN", chinese, function(chineseTranslation) {

                            test2(masterNode);

                        });
                    });
                });
            });
        };

        var test2 = function(masterNode) {
            masterNode.translations().editions(function(editions) {

                equal(editions.length , 1 , "There should have been 1 edition.");

                masterNode.translations().locales("edition1", function(locales) {

                    equal(locales.length , 2 , "There should have been 2 locales.");

                    test3(masterNode);

                });
            })
        };

        var test3 = function(masterNode) {
            masterNode.translations().translate("de_DE", function(germanLocalized) {

                equal(germanLocalized.getTitle() , "german1" , "Got german back.");

                test4(masterNode);

            });
        };

        var test4 = function(masterNode) {
            masterNode.translations().translate("edition1", "zh_CN", function(chineseLocalized) {

                equal(chineseLocalized.getTitle() , "chinese1","Get chinese back.");

                test5(masterNode);

            });
        };

        var test5 = function(masterNode) {
            masterNode.translations().translate("xx_YY", function(unlocalized) {

                equal(unlocalized.getTitle() , "english1" ,"Gott unlocalized back");
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
