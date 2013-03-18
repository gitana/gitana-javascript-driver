(function($) {

    module("log1");

    // Test case : Log operations.
    test("Log Operations", function() {
        stop();

        expect(3);

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
                    "clientKey": clientConfig.getKey(),
                    "clientSecret": clientConfig.getSecret()
                }).authenticate({
                    "username": user.getName(),
                    "password": "pw"
                }).then(function() {

                    // NOTE: this = platform

                    // build stack #1
                    var stack1 = null;
                    var repository1 = null;
                    this.createRepository().then(function() {
                        repository1 = this;
                    });
                    var domain1 = null;
                    this.createDomain().then(function() {
                        domain1 = this;
                    });
                    var vault1 = null;
                    this.createVault().then(function() {
                        vault1 = this;
                    });
                    this.createStack().then(function() {

                        // NOTE: this = stack
                        stack1 = this;

                        this.assignDataStore(repository1);
                        this.assignDataStore(domain1);
                        this.assignDataStore(vault1);
                    });


                    // build stack #2
                    var stack2 = null;
                    var repository2 = null;
                    this.createRepository().then(function() {
                        repository2 = this;
                    });
                    this.createStack().then(function() {

                        // NOTE: this = stack
                        stack2 = this;

                        this.assignDataStore(repository2);
                    });


                    // count the original sizes
                    var platformSize1 = -1;
                    var stack1Size1 = -1;
                    var stack2Size1 = -1;
                    this.then(function() {

                        // NOTE: this = platform

                        // check the base size of the platform logs
                        this.queryLogEntries().count(function(count) {
                            platformSize1 = count;
                        });

                        // check the base size of the stack #1 logs
                        this.subchain(stack1).queryLogEntries().count(function(count) {
                            stack1Size1 = count;
                        });

                        // check the base size of the stack #2 logs
                        this.subchain(stack2).queryLogEntries().count(function(count) {
                            stack2Size1 = count;
                        });
                    });



                    // now generate a log message on stack #1
                    // we do this by binding a behavior to a node that triggers on update
                    // and then we update to trigger the log message
                    this.then(function() {
                        this.subchain(repository1).then(function() {

                            // NOTE: this = repository1

                            this.readBranch("master").then(function() {

                                // NOTE: this = branch

                                this.then(function() {

                                    // create a script node that just logs
                                    var scriptNode = null;
                                    this.createNode().then(function() {

                                        // NOTE: this = script node
                                        scriptNode = this;

                                        this.attach("default", "application/javascript", "function afterUpdateNode(node, originalNode) { logger.debug('log function hit'); }");
                                    });

                                    // create a content node
                                    this.createNode().then(function() {

                                        // bind the script as a behavior (p:afterUpdateNode)
                                        this.associate(scriptNode, {
                                            "_type": "a:has_behavior",
                                            "policy": "p:afterUpdateNode",
                                            "scope": 0
                                        }, false);

                                        // update the node
                                        // this triggers a log message to be generated
                                        this.update();
                                    });
                                });
                            });
                        });
                    });



                    // count the new sizes
                    var platformSize2 = -1;
                    var stack1Size2 = -1;
                    var stack2Size2 = -1;
                    this.then(function() {

                        // NOTE: this = platform

                        // check the new size of the platform logs
                        this.queryLogEntries().count(function(count) {
                            platformSize2 = count;
                        });

                        // check the new size of the stack #1 logs
                        this.subchain(stack1).queryLogEntries().count(function(count) {
                            stack1Size2 = count;
                        });

                        // check the new size of the stack #2 logs
                        this.subchain(stack2).queryLogEntries().count(function(count) {
                            stack2Size2 = count;
                        });
                    });


                    // verify
                    this.then(function() {

                        // NOTE: this = platform

                        // verify that platform logs are larger by 1
                        equal(platformSize2, platformSize1 + 1);

                        // verify that stack #1 logs are larger by 1
                        equal(stack1Size2, stack1Size1 + 1);

                        // verify that stack #2 logs are unchanged
                        equal(stack2Size2, stack2Size1);

                        success();
                    });
                });

            });
        });

        var success = function() {
            start();
        };

    });

}(jQuery) );
