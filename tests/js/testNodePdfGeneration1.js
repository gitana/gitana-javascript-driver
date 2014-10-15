(function() {

    module("nodePdfGeneration1");

    // Test case : Node PDF Generation 1
    _asyncTest("Node PDF Generation 1", function()
    {
        expect(2);

        var fn = function(ftl)
        {
            var gitana = GitanaTest.authenticateFullOAuth();
            gitana.createRepository().readBranch("master").then(function() {

                // NOTE: this = branch
                var branch = this;

                // create a pdf generation template
                var pdfTemplate = null;
                this.createNode({
                    "type": "n:pdf"
                }).then(function() {
                    pdfTemplate = this;
                }).attach("default", "application/freemarker", ftl);

                // create content type - workspace
                this.createNode({
                    "_type": "d:type",
                    "_qname": "web:workspace",
                    "title": "Web Workspace",
                    "type": "object",
                    "properties": {
                        "assignmentName": {
                            "type": "string"
                        },
                        "flowName": {
                            "type": "string"
                        },
                        "submissionName": {
                            "type": "string"
                        },
                        "type": {
                            "type": "string"
                        },
                        "requireVerification": {
                            "type": "boolean"
                        },
                        "uid": {
                            "type": "string"
                        },
                        "id": {
                            "type": "string"
                        },
                        "logo": {
                            "type": "string"
                        },
                        "name": {
                            "type": "string"
                        },
                        "title": {
                            "type": "string"
                        },
                        "information": {
                            "type": "string"
                        },
                        "address1": {
                            "type": "string"
                        },
                        "address2": {
                            "type": "string"
                        },
                        "properties": {
                            "type": "object",
                            "properties": {
                                "startDate": {
                                    "type": "number"
                                },
                                "endDate": {
                                    "type": "number"
                                },
                                "totalGrantAmount": {
                                    "type": "string"
                                }
                            }
                        },
                        "details": {
                            "type": "object"
                        }
                    }
                });

                // create content type - web
                this.createNode({
                    "_type": "d:type",
                    "_qname": "web:workspace-submission",
                    "title": "Web Workspace Submission",
                    "type": "object",
                    "properties": {
                        "assignmentId": {
                            "type": "string"
                        },
                        "data": {
                            "type": "object",
                            "properties": {
                                "fundsReceived": {
                                    "type": "string"
                                },
                                "carryOverBalance": {
                                    "type": "string"
                                },
                                "personnelExpenses": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "category": {
                                                "type": "string"
                                            },
                                            "effort": {
                                                "type": "number"
                                            },
                                            "actual": {
                                                "type": "string"
                                            },
                                            "notes": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "directCosts": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "category": {
                                                "type": "string"
                                            },
                                            "effort": {
                                                "type": "number"
                                            },
                                            "actual": {
                                                "type": "string"
                                            },
                                            "notes": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "encumbrances": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "category": {
                                                "type": "string"
                                            },
                                            "effort": {
                                                "type": "number"
                                            },
                                            "actual": {
                                                "type": "string"
                                            },
                                            "notes": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "userName": {
                                    "type": "string"
                                },
                                "email": {
                                    "type": "string"
                                },
                                "telephoneNumber": {
                                    "type": "string"
                                },
                                "certificationDate": {
                                    "type": "string"
                                }
                            }
                        },
                        "to": {
                            "type": "string"
                        },
                        "flowId": {
                            "type": "string"
                        },
                        "id": {
                            "type": "string"
                        },
                        "createdAt": {
                            "type": "string"
                        }
                    }
                });

                // create workspace
                var workspaceNode = null;
                this.createNode({
                    "properties": {
                        "payments": [
                            {
                                "paymentId": 3049,
                                "year": 2013,
                                "amount": 150000,
                                "fmvStock": 0,
                                "cash": 150000,
                                "paymentDate": "2013-10-28T04:00:00.000Z",
                                "scheduleDate": "2013-10-18T04:00:00.000Z"
                            },
                            {
                                "paymentId": 3048,
                                "year": 2012,
                                "amount": 150000,
                                "fmvStock": 0,
                                "cash": 150000,
                                "paymentDate": "2012-10-22T04:00:00.000Z",
                                "scheduleDate": "2012-10-12T04:00:00.000Z"
                            },
                            {
                                "paymentId": 3047,
                                "year": 2011,
                                "amount": 150000,
                                "fmvStock": 152379.2,
                                "cash": 0,
                                "paymentDate": "2011-10-18T04:00:00.000Z",
                                "scheduleDate": "2011-10-14T04:00:00.000Z"
                            },
                            {
                                "paymentId": 3046,
                                "year": 2010,
                                "amount": 150000,
                                "fmvStock": 148987.56,
                                "cash": 0,
                                "paymentDate": "2010-10-27T04:00:00.000Z",
                                "scheduleDate": "2010-10-15T04:00:00.000Z"
                            }
                        ],
                        "name": "Test University - Department of Psychology",
                        "subdivision": "Department of Psychology",
                        "grantType": "Scholar-6 Year Term",
                        "grantId": "220020252",
                        "startDate": 1285905600000,
                        "endDate": 1475294400000,
                        "organizationId": "701",
                        "organizationName": "Test University",
                        "period": "October 1, 2010 to October 1, 2016",
                        "totalAmount": "$600,000.00",
                        "details": [
                            {
                                "key": "Grant #",
                                "value": "220020252"
                            },
                            {
                                "key": "Project Dates",
                                "value": "October 1, 2010 to October 1, 2016"
                            },
                            {
                                "key": "Organization",
                                "value": "Test University"
                            },
                            {
                                "key": "Total Grant Amount",
                                "value": "$600,000.00"
                            },
                            {
                                "key": "Project Title",
                                "value": "Compositionality in probabilistic models of cognition"
                            },
                            {
                                "key": "Grant Type",
                                "value": "Scholar-6 Year Term"
                            },
                            {
                                "key": "Name of Researcher",
                                "value": "Noah Goodman"
                            },
                            {
                                "key": "Program Area",
                                "value": "21st Century Science Initiative-Understanding Human Cognition / UHC Scholar"
                            }
                        ],
                        "principalInvestigator": {
                            "firstName": "Bob",
                            "lastName": "Smith",
                            "salutation": "Dr. Smith",
                            "email": "test@test.edu"
                        },
                        "address1": "Office of Sponsored Research",
                        "address2": "Test 14245-3121"
                    },
                    "title": "220020252",
                    "_doc": "3d4b3435ae68e78cc376"
                }).then(function() {
                    workspaceNode = this;
                });

                // create submission node
                var submissionNode = null;
                this.createNode({
                    "timestamp": 1413397472313,
                    "state": "submit",
                    "assignmentId": "b1d94eee703c0058b154",
                    "status": "error",
                    "reportType": "financial",
                    "data": {
                        "rewardAmount": "$600,000.00",
                        "estamatedAmountRecieved": "$601,366.76",
                        "personnelExpenses": [
                            {
                                "includesFringe": false,
                                "category": "PI",
                                "effort": 1,
                                "actual": "$6,184.00",
                                "notes": "John Smith, PI"
                            },
                            {
                                "includesFringe": false,
                                "effort": 100,
                                "category": "Postdoc",
                                "actual": "$27,927.00",
                                "notes": "Bob Jones, Postdoc"
                            },
                            {
                                "includesFringe": false,
                                "notes": "Arnold Palmer, Postdoc",
                                "actual": "$123,101.00",
                                "effort": 100,
                                "category": "Postdoc"
                            },
                            {
                                "includesFringe": false,
                                "notes": "Doc Severinson, Research Asst Grad",
                                "actual": "$4,310.00",
                                "effort": 50,
                                "category": "Research Assistant/Specialist"
                            },
                            {
                                "includesFringe": false,
                                "category": "Research Assistant/Specialist",
                                "notes": "Eric Esser, Non Exempt RA",
                                "actual": "$64,725.00",
                                "effort": 100
                            },
                            {
                                "includesFringe": false,
                                "notes": "Houston Wilson, Contingent RA",
                                "actual": "$12,231.00",
                                "effort": 75,
                                "category": "Research Assistant/Specialist"
                            },
                            {
                                "includesFringe": false,
                                "notes": "Randy Barant, Contingent RA",
                                "actual": "$7,717.00",
                                "effort": 75,
                                "category": "Research Assistant/Specialist"
                            }
                        ],
                        "directCosts": [
                            {
                                "category": "Other",
                                "actual": "$10,273.00",
                                "notes": "Student Aid"
                            },
                            {
                                "category": "Supplies",
                                "actual": "$16,029.00"
                            },
                            {
                                "category": "PI/Co-PI Travel",
                                "actual": "$43,033.00"
                            },
                            {
                                "category": "Other",
                                "notes": "Human Subjects",
                                "actual": "$22,333.00"
                            },
                            {
                                "category": "Other",
                                "notes": "Other",
                                "actual": "$22,333.00"
                            }
                        ],
                        "encumbrances": [],
                        "fundsReceived": "$600,000.00",
                        "carryOverBalanceFromLastYear": "$0.00",
                        "expensesTotal": 360196,
                        "encumbrancesTotal": 0,
                        "carryOver": 239804,
                        "totalCosts": 360196,
                        "noCostExtension": false,
                        "userName": "Malcolm Teasdale, Research Accountant",
                        "email": "mteasdale@test.edu",
                        "telephoneNumber": "650-723-0637",
                        "certificationDate": "2014-10-07"
                    },
                    "workflowId": "1c4b0752af90cf5ad43f",
                    "submittedOn": 1413398119236,
                    "submittedBy": [
                        {
                            "ip": "127.0.0.1",
                            "host": "localhost"
                        },
                        {
                            "ip": "127.0.0.1",
                            "host": "localhost"
                        },
                        {
                            "ip": "127.0.0.1",
                            "host": "localhost"
                        },
                        {
                            "ip": "127.0.0.1",
                            "host": "localhost"
                        }
                    ],
                    "_doc": "8c641963ac33df7f8e3c"
                }).then(function() {
                    submissionNode = this;
                });

                // create pdf node
                var pdfNode = null;
                this.createNode({
                    "title": "PDF"
                }).then(function() {
                    pdfNode = this;
                });

                this.then(function() {

                    var exportId = null;
                    var status = null;

                    var resources = [];
                    resources.push(workspaceNode);
                    resources.push(submissionNode);
                    resources.push(pdfNode);

                    var platform = Chain(branch.getPlatform());
                    platform.runExport(resources, {
                        'package':           'PDF',
                        'mergePdfs':          true,
                        'includeMetadata':    true,
                        'includeAttachments': true,
                        'pdfTemplateRepositoryId':  pdfTemplate.getRepositoryId(),
                        'pdfTemplateBranchId':      pdfTemplate.getBranchId(),
                        'pdfTemplateNodeId':        pdfTemplate.getId()
                    }, function(_exportId, _status) {
                        exportId = _exportId;
                        status   = _status;
                    });
                    platform.then(function() {

                        ok(status.state == "FINISHED", "Export finished");

                        var exportConfig = {
                            properties: {
                                title:        "Test Title",
                                generatedPdf: true,
                                assignmentId: "Test Assignment ID",
                                submissionId: "Test Submission ID"
                            },
                            extraInfo: {
                                parentFolder: "/Test"
                            }
                        };

                        Chain(branch).createForExport(exportId, exportConfig, function(response) {

                            ok(response.rows.length === 1, "Generated one PDF node");

                            success();
                        });
                    });
                });
            });

            var success = function() {
                start();
            };
        };

        // load FTL
        $.ajax({
            "type": "get",
            "url": "/tests/files/pdf_template1.ftl"
        }).done(function(text) {
            fn(text);
        });

    });

}());
