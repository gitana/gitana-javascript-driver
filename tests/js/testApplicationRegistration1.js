(function($) {

    module("applicationRegistration1");

    // Test case : Application Registration
    test("Application Registration 1", function()
    {
        stop();

        expect(14);

        var gitana = GitanaTest.authenticateFullOAuth();
        gitana.then(function() {

            // NOTE: this = platform

            // create a domain where our registered user will be created
            var domain = null;
            this.createDomain().then(function() {
                domain = this;
            });

            // create a registrar where our registered tenant will be created
            // this will have two plans: plan1, plan2
            var registrar = null;
            this.then(function() {
                this.createRegistrar().then(function() {
                    registrar = this;
                    this.createPlan({
                        "planKey": "plan1"
                    });
                    this.createPlan({
                        "planKey": "plan2"
                    });
                });
            });

            this.then(function() {

                // create an application
                this.createApplication().then(function() {

                    // create an email provider
                    var emailProvider = null;
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

                    // create some registrations
                    var registration1 = null;
                    this.then(function() {
                        this.createRegistration({
                            "userEmail": "user1@test.com",
                            "userDomainId": domain.getId(),
                            "tenantPlanKey": "plan1",
                            "tenantRegistrarId": registrar.getId(),
                            "emailProviderId": emailProvider.getId(),
                            "emails": {
                                "confirmation": {
                                    "body": "Please confirm!",
                                    "from": "buildtest@gitanasoftware.com"
                                },
                                "welcome": {
                                    "body": "Welcome!",
                                    "from": "buildtest@gitanasoftware.com"
                                }
                            }
                        }).then(function() {
                            registration1 = this;
                        });
                        this.createRegistration({
                            "userEmail": "user2@test.com",
                            "tenantPlanKey": "plan2",
                            "userDomainId": domain.getId(),
                            "tenantRegistrarId": registrar.getId(),
                            "emailProviderId": emailProvider.getId()
                        });
                        this.createRegistration({
                            "userEmail": "user2@test.com",
                            "tenantPlanKey": "plan2",
                            "userDomainId": domain.getId(),
                            "tenantRegistrarId": registrar.getId(),
                            "emailProviderId": emailProvider.getId()
                        });

                        // confirm via query
                        this.listRegistrations().count(function(count) {
                            equal(count, 3, "Found three registrations");
                        });
                        this.queryRegistrations({"tenantPlanKey": "plan2"}).count(function(count) {
                            equal(count, 2, "Found two plans");
                        });
                        this.queryRegistrations({"tenantPlanKey": "plan1"}).count(function(count) {
                            equal(count, 1, "Found one plan");
                        });
                    });

                    this.then(function() {

                        // send the first one's confirmation email
                        this.subchain(registration1).sendConfirmationEmail().reload().then(function() {

                            // verify the confirmation email was sent
                            ok(this.get("confirmationSent"), "Confirmation was sent");

                            // and now, at this point, they'd presumably supply some more information
                            // so we supply it here
                            this.set("userName", "bud");
                            this.set("userProperties", {
                                "firstName": "Houston",
                                "lastName": "Wilson",
                                "school": "Elm Dale"
                            });
                            this.set("tenantTitle", "Dixie");
                            this.set("tenantDescription", "Flatline");
                            this.get("signupProperties")["company"] = "Illymani Designs";
                            this.update();

                            this.then(function() {

                                // now confirm the registration (and supply password)
                                this.confirm("password").reload().then(function() {

                                    // verify the registration completed
                                    ok(this.get("completed"), "Registration completed");
                                    ok(this.get("completedPrincipalId"), "Completed principal ID ok");
                                    ok(this.get("completedTenantId"), "Completed tenant ID ok");
                                    equal(this.get("signupProperties")["company"], "Illymani Designs");

                                    registration1 = this;

                                });
                            });
                        });
                    });

                    // verify the tenant + get client key/secret
                    var newClientKey = null;
                    var newClientSecret = null;
                    this.then(function() {
                        this.subchain(registrar).readTenant(registration1.get("completedTenantId")).then(function() {
                            equal(this.getTitle(), "Dixie");
                            equal(this.getDescription(), "Flatline");

                            this.readDefaultAllocatedClientObject(function(object) {
                                newClientKey = object["key"];
                                newClientSecret = object["secret"];
                            });
                        });
                    });

                    // read the newly created user
                    var userId = null;
                    this.then(function() {
                        this.subchain(domain).readPrincipal(registration1.get("completedPrincipalId")).then(function() {
                            this.readIdentity().findPolicyUserForTenant(registration1.get("completedTenantId")).then(function() {
                                userId = this.getId();
                            });
                        });
                    });

                    // now connect to the new platform
                    this.then(function() {

                        new Gitana({
                            "clientKey": newClientKey,
                            "clientSecret": newClientSecret
                        }).authenticate({
                            "username": "bud",
                            "password": "password"
                        }).then(function() {

                            this.readPrimaryDomain().readPrincipal(userId).then(function() {
                                ok(true, "Found primary domain user");

                                equal(this.get("firstName"), "Houston", "Found user first name");
                                equal(this.get("lastName"), "Wilson", "Found user last name");
                                equal(this.get("school"), "Elm Dale", "Found user school");

                                success();
                            });
                        });

                    });
                });
            });

        });

        var success = function()
        {
            start();
        };

    });

}(jQuery) );
