var testI18N = function()
{
    var driver = new Gitana.Driver();

    var setupHandler1 = function(status)
    {
        if (!status.isOk())
        {
            alert("Create failed");
        }

        // read the repository back
        driver.repositories().read(status.getId(), setupHandler2);
    };

    var setupHandler2 = function(repository)
    {
        var _this = this;

        this.repository = repository;

        // read the master branch
        this.repository.branches().read("master", function(branch) {

            _this.branch = branch;

            test1();
        });
    };

    var test1 = function()
    {
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
                masterNode.translations().create("edition1", "de_ED", german, function(germanTranslation) {

                    // build a translation into chinese "edition1"
                    var chinese = { "title": "chinese1" };
                    masterNode.translations().create("edition1", "zh_CN", chinese, function(chineseTranslation) {

                        test2(masterNode);

                    });
                });
            });
        });
    };

    var test2 = function(masterNode)
    {
        masterNode.translations().editions(function(editions){

            if (editions.length != 1)
            {
                alert("There should have been 1 edition");
            }

            masterNode.translations().locales("edition1", function(locales) {

                if (locales.length != 2)
                {
                    alert("There should have been 2 locales");
                }

                test3(masterNode);

            });
        })
    };

    var test3 = function(masterNode)
    {
        masterNode.translations().translate("de_ED", function(germanLocalized) {

            if (germanLocalized.getTitle() != "german1")
            {
                alert("didn't get german back");
            }

            test4(masterNode);

        });
    };

    var test4 = function(masterNode)
    {
        masterNode.translations().translate("edition1", "zh_CN", function(chineseLocalized) {

            if (chineseLocalized.getTitle() != "chinese1")
            {
                alert("didn't get chinese back");
            }

            test5(masterNode);

        });
    };

    var test5 = function(masterNode)
    {
        masterNode.translations().translate("xx_YY", function(unlocalized) {

            if (unlocalized.getTitle() != "english1")
            {
                alert("didn't get unlocalized back");
            }

            success();

        });
    };

    var success = function()
    {
        alert("success");
    };

    // kick off the test after logging in
    driver.security().authenticate("admin", "admin", function() {
        driver.repositories().create(setupHandler1);
    });

};
