(function($) {

    module("platformTenantAttachments1");

    // Test case : Platform Tenant Attachments 1
    test("Platform Tenant Attachments", function() {
        stop();

        expect(15);

        var user = null;
        var clientConfig = null
        var tenant = null;

        // authenticate as admin (on admin tenant)
        GitanaTest.authenticateFullOAuth().then(function() {

            // NOTE: this = platform

            // create a user
            this.readPrimaryDomain().createUser({
                "name": "test-" + new Date().getTime(),
                "password": "pw"
            }).then(function() {
                user = this;
            });

            // create a tenant for this user
            this.then(function() {

                this.readRegistrar("default").createTenant(user, "unlimited").then(function() {

                    // NOTE: this = tenant
                    tenant = this;

                    // read the default client
                    this.readDefaultAllocatedClientObject(function(theClientConfig) {
                        clientConfig = theClientConfig;
                    });

                });

            });

            // sign in as the new client/user
            // note that we're signing in as the user on the tenant platform (which is a copy of the original user)
            this.then(function() {

                new Gitana({
                    "clientId": clientConfig.getKey(),
                    "clientSecret": clientConfig.getSecret()
                }).authenticate({
                    "username": user.getName(),
                    "password": "pw"
                }).then(function() {

                    // NOTE: this = platform

                    // all of these operations are against the platform's parent tenant

                    // create a bunch of text attachments
                    this.tenantAttach("attachmentId1", "text/plain", "first");
                    this.tenantAttach("attachmentId2", "text/plain", "second");
                    this.tenantAttach("attachmentId3", "text/plain", "third");
                    this.tenantAttach("attachmentId4", "text/plain", "fourth");


                    // list and verify
                    this.listTenantAttachments().count(function(count) {
                        equal(count, 4, "Attachment size is 4");
                    });

                    // get an attachment, play with its properties and download it
                    this.tenantAttachment("attachmentId1").then(function() {

                        var length = this.getLength();
                        ok(length > 0, "Length greater than zero");

                        var attachmentId = this.getId();
                        equal(attachmentId, "attachmentId1", "Correct attachment ID");

                        var contentType = this.getContentType();
                        equal("text/plain", contentType, "Correct content type");

                        var uri = this.getUri();
                        ok(uri, "Computed uri: " + uri);

                        var downloadUri = this.getDownloadUri();
                        ok(downloadUri, "Computed download uri: " + downloadUri);
                    });

                    // walk through all attachments and verify something
                    this.listTenantAttachments().each(function() {

                        var length = this.getLength();
                        ok(length > 0, "Iteration length > 0");
                    });

                    // download attachment
                    this.tenantAttachment("attachmentId2").download(function(data) {
                        ok(data.length > 0, "Download works");
                    });

                    // delete attachment (using list + select)
                    this.listTenantAttachments().select("attachmentId3").del();

                    // list and verify
                    this.listTenantAttachments().count(function(count) {
                        equal(count, 3, "Attachment size is 3");
                    });

                    // try to request an attachment that doesn't exist and verify
                    this.trap(function() {
                        ok(true, "Handled missing attachment correctly");
                    }).tenantAttachment("missing").getDownloadUri();


                    this.then(function() {

                        // log back in as the parent tenant

                        // authenticate as admin (on admin tenant)
                        GitanaTest.authenticateFullOAuth().then(function() {

                            // NOTE: this = platform

                            // read the tenant
                            this.readRegistrar("default").readTenant(tenant.getId()).then(function() {

                                // NOTE: this = tenant

                                // verify that there are 3 attachments
                                this.listAttachments(true).count(function(count) {
                                    equal(3, count, "Found 3 attachments on parent tenant (local)");
                                });

                                // verify with remote loading
                                this.listAttachments(true).count(function(count) {
                                    equal(3, count, "Found 3 attachments on parent tenant (remote)");
                                    success();
                                });

                            });

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
