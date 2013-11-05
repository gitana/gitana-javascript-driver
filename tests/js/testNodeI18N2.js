(function($) {

    module("nodeI18N2");

    // Test case : I18N 2.
    _asyncTest("I18N 2", function()
    {


        expect(4);

        var r1 = null;
        var platform = GitanaTest.authenticateFullOAuth();
        platform.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch
            r1 = this.getRepositoryId();

            // create a master node
            var masterObject = {
                "title": "english1",
                "_features": {
                    "f:multilingual": {
                        "edition": "edition1"
                    }
                }
            };
            var masterNode = null;
            this.createNode(masterObject).then(function() {

                // NOTE: this = master node
                masterNode = this;

                // create a translation node for "edition1" in german
                var german = { "title": "german1" };
                this.createTranslation("edition1", "de_DE", german);

                // create a translation node for "edition1" in chinese
                var chinese = { "title": "chinese1" };
                this.createTranslation("edition1", "zh_CN", chinese);

            });

            this.then(function() {

                // NOTE: this = branch

                // switch locale to "de_DE"
                this.getDriver().setLocale("de_DE");

                // read back the node and verify we get german
                this.readNode(masterNode.getId()).then(function() {
                    equal(this.getTitle(), "german1", "Got german back!");
                });

            });

            this.then(function() {

                // NOTE: this = branch

                // switch locale to "zh_CN"
                this.getDriver().setLocale("zh_CN");

                // read back the node and verify we get chinese
                this.readNode(masterNode.getId()).then(function() {
                    equal(this.getTitle(), "chinese1", "Got chinese back 1!");
                });

            });

            this.then(function() {

                // NOTE: this = branch

                // switch to unknown locale ("xx_YY") and ensure it falls back to master node
                this.getDriver().setLocale("xx_YY");

                // read back the node and verify we get master
                this.readNode(masterNode.getId()).then(function() {
                    equal(this.getTitle(), "english1", "Got master node back!");
                });

            });

            this.then(function() {

                // restart driver and set locale up front to verify instantiation works
                // verify we get chinese

                var gitana = GitanaTest.authenticateFullOAuth({
                    "locale": "zh_CN"
                });

                gitana.readRepository(r1).readBranch("master").readNode(masterNode.getId()).then(function() {
                    equal(this.getTitle(), "chinese1", "Got chinese back 2!");

                    success();
                });

            });

        });

        var success = function() {
            start();
        };

    });

}(jQuery) );
