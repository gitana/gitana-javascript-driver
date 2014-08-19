(function($) {

    module("nodeExportEmail1");

    // Test case : Node Export Email Test #1
    _asyncTest("Node Export Email #1", function()
    {
        expect(1);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            // 0. create a application + email provider
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

            // 1. create nodes
            var nodes = null;
            this.then(function() {
                this.createRepository().readBranch("master").then(function() {

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
                        nodes = this;
                    });
                });
            });

            // 2. export the nodes
            var exportId = null;
            var status = null;
            this.then(function() {

                // export the nodes
                this.runExport(nodes, {
                    "package": "ZIP",
                    "zipUsePdfEntries": true
                }, function(_exportId, _status) {
                    exportId = _exportId;
                    status = _status;
                });

            });

            // 3. email the export
            this.then(function() {
                this.subchain(emailProvider).then(function() {

                    // NOTE: this = email provider

                    var emailConfig = {
                        "to": "buildtest@gitanasoftawre.com",
                        "from": "buildtest@gitanasoftware.com",
                        //"cc": "",
                        "subject": "test subject",
                        "body": "test body"
                    };

                    this.sendForExport(exportId, emailConfig, function() {
                        ok(true, "Email was sent");
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
