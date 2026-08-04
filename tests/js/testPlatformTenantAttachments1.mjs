import { describe, it } from "node:test";
import { Gitana, GitanaTest, guard } from "../support.mjs";

describe("platformTenantAttachments1", function() {

    it("Platform Tenant Attachments", { "timeout": 120000 }, function(t) {

        // the driver keeps global state (auth, caches) between tests
        Gitana.reset();

        t.plan(15);

        return guard(t, function(start) {
            var user = null;
            var clientConfig = null
            var tenant = null;

            // authenticate as admin (on admin tenant)
            GitanaTest.authenticateFullOAuth().then(function() {

                // NOTE: this = platform

                // create a user
                this.readPrimaryDomain().createUser({
                    "name": "test-" + new Date().getTime(),
                    "password": "pw123456"
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
                        "clientKey": clientConfig.getKey(),
                        "clientSecret": clientConfig.getSecret()
                    }).authenticate({
                        "username": user.getName(),
                        "password": "pw123456"
                    }, function(err) {
                        console.warn(err);
                        return start();
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
                            t.assert.equal(count, 4, "Attachment size is 4");
                        });

                        // get an attachment, play with its properties and download it
                        this.tenantAttachment("attachmentId1").then(function() {

                            var length = this.getLength();
                            t.assert.ok(length > 0, "Length greater than zero");

                            var attachmentId = this.getId();
                            t.assert.equal(attachmentId, "attachmentId1", "Correct attachment ID");

                            var contentType = this.getContentType();
                            t.assert.equal("text/plain", contentType, "Correct content type");

                            var uri = this.getUri();
                            t.assert.ok(uri, "Computed uri: " + uri);

                            var downloadUri = this.getDownloadUri();
                            t.assert.ok(downloadUri, "Computed download uri: " + downloadUri);
                        });

                        // walk through all attachments and verify something
                        this.listTenantAttachments().each(function() {

                            var length = this.getLength();
                            t.assert.ok(length > 0, "Iteration length > 0");
                        });

                        // download attachment
                        this.tenantAttachment("attachmentId2").download(function(data) {
                            t.assert.ok(data.length > 0, "Download works");
                        });

                        // delete attachment (using list + select)
                        this.listTenantAttachments().select("attachmentId3").del();

                        // list and verify
                        this.listTenantAttachments().count(function(count) {
                            t.assert.equal(count, 3, "Attachment size is 3");
                        });

                        // try to request an attachment that doesn't exist and verify
                        this.trap(function() {
                            t.assert.ok(true, "Handled missing attachment correctly");
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
                                        t.assert.equal(3, count, "Found 3 attachments on parent tenant (local)");
                                    });

                                    // verify with remote loading
                                    this.listAttachments(false).count(function(count) {
                                        t.assert.equal(3, count, "Found 3 attachments on parent tenant (remote)");
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
    });
});
