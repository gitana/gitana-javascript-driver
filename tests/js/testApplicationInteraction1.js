(function($) {

    module("applicationInteraction1");

    // Test case : Application interactions
    _asyncTest("Application Interactions 1", function()
    {
        expect(4);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            // create a user
            var user = null;
            this.readPrimaryDomain().createUser({
                "name": "testuser-" + new Date().getTime()
            }).then(function() {
                user = this;
            });

            // create a content node
            var node = null;
            this.createRepository().readBranch("master").createNode().then(function() {
                node = this;
            });

            // create an application and then some interactions for it
            this.createApplication().then(function()
            {
                // NOTE: this = application

                var interactionSession = null;

                this.createInteractionSession({
                    "timestamp": {
                        "start": new Date().getTime()
                    }
                }).then(function() {

                    // NOTE: this = interaction session
                    interactionSession = this;

                    // 1 - create the "start_session" interaction (REQUIRED)
                    this.createInteraction({
                        "application": {
                            "host": "test.cloudcms.com",
                            "uri": "/login",
                            "url": "http://test.cloudcms.com/login"
                        },
                        "event": {
                            "type": "start_session"
                        },
                        "principal": {
                            "domainId": user.getDomainId(),
                            "id": user.getId()
                        },
                        "source": {
                            "user-agent": "firefox",
                            "host": "firewall.marriott.com",
                            "ip": "12.34.56.78"
                        },
                        "timestamp": {
                            "ms": new Date().getTime()
                        }
                    });

                    // 2 - create a "click" interaction
                    this.createInteraction({
                        "application": {
                            "host": "test.cloudcms.com",
                            "uri": "/pages/page1",
                            "url": "http://test.cloudcms.com/pages/page1"
                        },
                        "element": {
                            "id": "id-103",
                            "type": "img",
                            "path": "/body/div/p/img"
                        },
                        "event": {
                            "type": "click",
                            "x": 400,
                            "y": 350,
                            "offsetX": 40,
                            "offsetY": 14
                        },
                        "node": {
                            "repositoryId": node.getRepositoryId(),
                            "branchId": node.getBranchId(),
                            "id": node.getId()
                        },
                        "principal": {
                            "domainId": user.getDomainId(),
                            "id": user.getId()
                        },
                        "source": {
                            "user-agent": "firefox",
                            "host": "firewall.marriott.com",
                            "ip": "12.34.56.78"
                        },
                        "timestamp": {
                            "ms": new Date().getTime()
                        }
                    });

                    // 2 - create a "mouseover" interaction
                    this.createInteraction({
                        "application": {
                            "host": "test.cloudcms.com",
                            "uri": "/pages/page1",
                            "url": "http://test.cloudcms.com/pages/page1"
                        },
                        "element": {
                            "id": "id-103",
                            "type": "img",
                            "path": "/body/div/p/img"
                        },
                        "event": {
                            "type": "mouseover",
                            "x": 300,
                            "y": 250,
                            "offsetX": 30,
                            "offsetY": 24
                        },
                        "node": {
                            "repositoryId": node.getRepositoryId(),
                            "branchId": node.getBranchId(),
                            "id": node.getId()
                        },
                        "principal": {
                            "domainId": user.getDomainId(),
                            "id": user.getId()
                        },
                        "source": {
                            "user-agent": "firefox",
                            "host": "firewall.marriott.com",
                            "ip": "12.34.56.78"
                        },
                        "timestamp": {
                            "ms": new Date().getTime()
                        }
                    });

                    // 4 - create the "end_session" interaction
                    this.createInteraction({
                        "application": {
                            "host": "test.cloudcms.com",
                            "uri": "/logout",
                            "url": "http://test.cloudcms.com/logout"
                        },
                        "event": {
                            "type": "end_session"
                        },
                        "principal": {
                            "domainId": user.getDomainId(),
                            "id": user.getId()
                        },
                        "source": {
                            "user-agent": "firefox",
                            "host": "firewall.marriott.com",
                            "ip": "12.34.56.78"
                        },
                        "timestamp": {
                            "ms": new Date().getTime()
                        }
                    });

                });

                this.then(function() {

                    // NOTE: this = application

                    // verify just 1 interaction session
                    this.listInteractionSessions().count(function(count) {
                        equal(count, 1, "Found 1 interaction session");
                    });

                    // read back interaction session
                    this.readInteractionSession(interactionSession.getId()).then(function() {
                        ok(true, "Able to read back interaction session");

                        // list interactions
                        // should find 4
                        this.listInteractions().count(function(count) {
                            equal(count, 4, "Found 4 interactions");
                        });

                        // query for all interactions on DOM element "id-103" on for url "http://test.cloudcms.com/pages/page1"
                        this.queryInteractions({
                            "element.id": "id-103",
                            "application.url": "http://test.cloudcms.com/pages/page1"
                        }).count(function(count) {
                            equal(count, 2, "Found 2 query matches");

                            // finished
                            start();
                        });
                    });
                });
            });
        });
    });

}(jQuery) );
