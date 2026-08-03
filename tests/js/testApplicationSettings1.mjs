import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("applicationSettings1", function() {

    it("Application Settings 1", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(14);

        return guard(t, function(start) {
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
                        t.assert.equal(count, 0, "No settings");
                    });

                    var applicationSettings;

                    this.readApplicationSettings().then(function() {
                        applicationSettings = this;
                    });

                    // should now be 1 setting
                    this.listSettings().count(function(count) {
                        t.assert.equal(count, 1, "One setting");
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
                        t.assert.equal(this.getSetting('key1'), 'val1', "String setting is set with correct value.");
                        t.assert.equal(this.getSetting('key2'), true, "Boolean setting is set with correct value.");
                        t.assert.deepEqual(this.getSetting('key3'), ['arr1','arr2'], "Array setting is set with correct value.");
                        t.assert.equal(this.getSetting('key4'), 3, "Integer setting is set with correct value.");
                        t.assert.deepEqual(this.getSetting('key5'), {
                            "foo" : "bar",
                            "foo2" : "bar2"
                        }, "Object setting is set with correct value.");
                    });

                    this.querySettings({
                        "settings.key1" : "val1"
                    }).count(function(count) {
                        t.assert.equal(count, 1, "Found the setting via query.");
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
                                    t.assert.equal(this.getSetting('ukey1'), 'val1', "Principal string setting is set with correct value.");
                                    t.assert.equal(this.getSetting('ukey2'), true, "Principal boolean setting is set with correct value.");
                                    t.assert.deepEqual(this.getSetting('ukey3'), ['arr1','arr2'], "Principal array setting is set with correct value.");
                                    t.assert.equal(this.getSetting('ukey4'), 3, "Principal integer setting is set with correct value.");
                                    t.assert.deepEqual(this.getSetting('ukey5'), {
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
                                t.assert.equal(count, 0, "Application settings has been deleted.");
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
    });
});
