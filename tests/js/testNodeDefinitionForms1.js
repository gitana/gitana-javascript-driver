(function($) {

    module("nodeDefinitionForms1");

    // Test case : Form operations.
    _asyncTest("Form operations", function()
    {


        expect(12);

        // content type
        var contentType = {
            "_qname": "custom:uzi1",
            "_type": "d:type"
        };

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.createRepository().readBranch("master").then(function() {

            // NOTE: this = branch

            // create new content type
            this.createNode(contentType);

            // read back the definition
            this.readDefinition("custom:uzi1").then(function() {

                // NOTE: this = definition
                var definition = this;

                // create three forms: simple, normal and complex
                this.createForm("simple");
                this.createForm("normal");
                this.createForm("complex");
                ok(true, "Created three forms");

                // read a form back
                this.readForm("simple");

                // pull back a list of all of the form associations for the type
                this.listFormAssociations().then(function() {
                    var associations = this;

                    // verify that we have three
                    this.count(function(count) {
                        equal(count, 3, "Created three forms");
                    });

                    // remove the second one
                    var formKey = associations.get(associations.__keys()[1]).getFormKey();
                    this.subchain(definition).removeFormAssociation(formKey).then(function() {

                        // count them
                        this.listFormAssociations().count(function(count) {
                            equal(count, 2, "Two forms left after one is removed");
                        });
                    });
                });

                // create a new form for this definition, called "test"
                // make sure it has some properties
                var obj = {
                    "property1": "value1",
                    "property2": {
                        "property3": "value3"
                    }
                };
                this.createForm("test", obj).then(function() {
                    ok(this["property1"], "Form has property1.");
                    ok(this["property2"]["property3"], "Form has property2.property3.");

                    // update the form
                    this["property4"] = "value4";
                    this.update().reload().then(function() {
                        ok(this["property1"], "Form has property1 after update.");
                        ok(this["property2"]["property3"], "Form has property2.property3 after update.");
                        ok(this["property4"], "Form has property4 after update.");
                    });
                });

                // read back the test form
                this.readForm("test").then(function() {

                    delete this["property1"];

                    this.update().then(function() {
                        ok(!this["property1"], "Does not have property1");

                        // replace with another json object
                        var obj = {
                            "replace1": "value1",
                            "replace2": "value2"
                        };
                        this.replacePropertiesWith(obj);
                        this.update().reload().then(function() {

                            equal(this["replace1"], "value1","Updated form has right value for property replace1.");
                            equal(this["replace2"], "value2","Updated form has right value for property replace2.");
                            ok(!this["property2"],"Updated form doesn't have property property2.");

                            success();
                        });
                    });
                });
            });
        });

        var success = function() {
            start();
        };

    });

}(jQuery) );
