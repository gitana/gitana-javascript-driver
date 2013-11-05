(function($) {

    module("applicationSettings1");

    // Test case : Application Settings
    _asyncTest("Application Settings 1", function()
    {
        expect(14);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            var platform = this;

            // create a application
            this.createApplication().then(function() {

                // NOTE: this = application

                var application = this;

                // ensure zero settings at onset
                this.listSettings().count(function(count) {
                    equal(count, 0, "No settings");
                });

                var applicationSettings;

                this.readApplicationSettings().then(function() {
                    applicationSettings = this;
                });

                // should now be 1 setting
                this.listSettings().count(function(count) {
                    equal(count, 1, "One setting");
                });

                this.then(function() {
                    this.subchain(applicationSettings).then(function() {

                        this.setSetting('key1','val1');
                        this.setSetting('key2',true);
                        this.setSetting('key3',['arr1','arr2']);
                        this.setSetting('key4',3);
                        this.setSetting('key5',{
                            "foo" : "bar",
                            "foo2" : "bar2"
                        });
                        this.update();

                    });
                });

                this.readApplicationSettings().then(function() {
                    equal(this.getSetting('key1'), 'val1', "String setting is set with correct value.");
                    equal(this.getSetting('key2'), true, "Boolean setting is set with correct value.");
                    deepEqual(this.getSetting('key3'), ['arr1','arr2'], "Array setting is set with correct value.");
                    equal(this.getSetting('key4'), 3, "Integer setting is set with correct value.");
                    deepEqual(this.getSetting('key5'), {
                        "foo" : "bar",
                        "foo2" : "bar2"
                    }, "Object setting is set with correct value.");
                });

                this.querySettings({
                    "settings.key1" : "val1"
                }).count(function(count) {
                    equal(count, 1, "Found the setting via query.");
                });

                this.subchain(platform).readPrimaryDomain().then(function() {

                    var user1 = null;
                    var userName1 = "user" + new Date().getTime();
                    this.createUser({
                        "name": userName1
                    }).then(function() {
                        user1 = this;
                        this.subchain(application).readApplicationPrincipalSettings(user1).then(function() {
                            this.setSetting('ukey1', 'val1');
                            this.setSetting('ukey2', true);
                            this.setSetting('ukey3', ['arr1','arr2']);
                            this.setSetting('ukey4', 3);
                            this.setSetting('ukey5', {
                                "foo" : "bar",
                                "foo2" : "bar2"
                            });
                            this.update().reload().then(function() {
                                equal(this.getSetting('ukey1'), 'val1', "Principal string setting is set with correct value.");
                                equal(this.getSetting('ukey2'), true, "Principal boolean setting is set with correct value.");
                                deepEqual(this.getSetting('ukey3'), ['arr1','arr2'], "Principal array setting is set with correct value.");
                                equal(this.getSetting('ukey4'), 3, "Principal integer setting is set with correct value.");
                                deepEqual(this.getSetting('ukey5'), {
                                    "foo" : "bar",
                                    "foo2" : "bar2"
                                }, "Object setting is set with correct value.");
                            });

                            this.then(function() {
                                this.subchain(user1).del();
                            });
                        });
                    });
                });

                this.then(function() {
                    this.subchain(applicationSettings).del().then(function() {
                        this.subchain(application).querySettings({
                            "settings.key1" : "val1"
                        }).count(function(count) {
                            equal(count, 0, "Application settings has been deleted.");
                        });
                    });
                });
                this.del();
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
