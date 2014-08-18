(function($) {

    module("nodeExportEmail1");

    // Test case : Node Export Email Test #1
    _asyncTest("Node Export Email #1", function()
    {
        expect(1);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // create a application
            var application = null;
            var emailProvider = null;
            this.createApplication().then(function() {

                // NOTE: this = application
                application = this;

                // create an email provider
                this.createEmailProvider({
                    "host": "smtp.gmail.com",
                    "username": "buildtest@gitanasoftware.com",
                    "password": "buildt@st11",
                    "smtp_enabled": true,
                    "smtp_requires_auth": true,
                    "smtp_is_secure": true,
                    "smtp_starttls_enabled": true
                }).then(function() {
                    emailProvider = this;
                });
            });

            this.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch
                var branch = this;

                // create a few nodes
                this.createNode({
                    "tag": "abc"
                });
                this.createNode({
                    "tag": "abc"
                });
                this.createNode({
                    "tag": "abc"
                });
                this.createNode({
                    "tag": "abc"
                });
                this.createNode({
                    "tag": "abc"
                });

                // now query back
                this.queryNodes({
                    "tag": "abc"
                }).then(function() {

                    // export the nodes
                    var exportId = null;
                    this.startExport({
                        "package": "ZIP",
                        "zipUsePdfEntries": true

                    }, function(_exportId) {
                        exportId = _exportId;
                    });

                    // wait for export to complete
                    var status = null;
                    this.then(function() {
                        // wait for the export to complete
                        this.waitForExport(exportId, function(_status) {
                            status = _status;
                        });
                    });

                    // email the export
                    this.then(function() {

                        var emailConfig = {
                            "to": "buildtest@gitanasoftawre.com",
                            "from": "buildtest@gitanasoftware.com",
                            //"cc": "",
                            "subject": "test subject",
                            "body": "test body"
                        };

                        this.exportEmail(exportId, application.getId(), emailProvider.getId(), emailConfig, function() {
                            ok(true, "Email was sent");
                        });
                    });
                });
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
