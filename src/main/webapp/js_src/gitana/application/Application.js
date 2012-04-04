(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Application = Gitana.AbstractPlatformDataStore.extend(
    /** @lends Gitana.Application.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Application
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.objectType = "Gitana.Application";

            this.base(platform, object);
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/applications/" + this.getId();
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return "application";
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().application(this.getPlatform(), this.object);
        },

        /**
         * Lists the auto-client mappings maintained for this application.
         *
         * @param callback the callback function
         * @param pagination
         *
         * @chained this
         */
        listAutoClientMappingObjects: function(callback, pagination)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/autoclientmappings";
            };

            // parameters
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainGetResponse(this, uriFunction, params).then(function() {
                callback.call(this, this.response["rows"]);
            });
        },

        

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // SETTINGS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Create settings
         *
         * @chained settings
         *
         * @param [Object] object JSON object
         */
        createSettings: function(object)
        {
            // Makes sure we have an empty settings key
            if (object["settings"] == null)
            {
                object["settings"] = {};
            }
            var chainable = this.getFactory().settings(this);
            return this.chainCreate(chainable, object, this.getUri() + "/settings");
        },

        /**
         * Lists the settings.
         *
         * @param pagination
         *
         * @chained settings map
         */
        listSettings: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().settingsMap(this);
            return this.chainGet(chainable, this.getUri() + "/settings", params);
        },

        /**
         * Reads an setting.
         *
         * @param stackId
         *
         * @chained stack
         */
        readSettings: function(settingId)
        {
            var chainable = this.getFactory().settings(this);
            return this.chainGet(chainable, this.getUri() + "/settings/" + settingId);
        },

        /**
         * Queries for settings.
         *
         * @chained settings map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        querySettings: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/settings/query";
            };

            var chainable = this.getFactory().settingsMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Reads the application settings for the given scope and key.
         * If the settings doesn't exist, creates an empty one.
         *
         * @param {String } scope (optional)
         * @param {String) key (optional)
         */
        readApplicationSettings: function(scope,  key)
        {
            var self = this;

            if (scope == null)
            {
                scope = "application";
            }

            if (key == null)
            {
                key = "application";
            }

            var object = {
                "scope" : scope,
                "key" : key
            };

            var settings = new Gitana.Settings(this,object);

            var result = this.subchain(settings);
            result.subchain().then(function() {

                var chain = this;
                var driver = self.getDriver();
                var createUri = self.getUri() + "/settings";
                var queryUri = self.getUri()  + "/settings/query";

                driver.gitanaPost(queryUri, {}, object, function(response) {
                    var settings = new Gitana.SettingsMap(self);
                    settings.handleResponse(response);
                    if (settings.keys.length > 0)
                    {
                        var obj = settings.map[settings.keys[0]];
                        result.loadFrom(obj);
                        chain.next();
                    }
                    else
                    {
                        object["settings"] = {};
                        driver.gitanaPost(createUri, null, object, function(status) {
                            driver.gitanaGet(createUri + "/" + status.getId(), null, function(response) {
                                chain.handleResponse(response);
                                chain.next();
                            }, function(http) {
                                self.httpError(http);
                            });
                        }, function(http) {
                            self.httpError(http);
                        });
                    }
                }, function(http) {
                    self.httpError(http);
                });

                return false;
            });

            return result;
        },

        /**
         * Reads the principal settings. It takes either a single Gitana.DomainPrincipal parameter
         * or a domain Id parameter and a principal Id parameter.
         */
        readApplicationPrincipalSettings: function()
        {
            var args = Gitana.makeArray(arguments);

            if (args.length == 1)
            {
                var principal = args.shift();
                return this.readApplicationSettings("principal", principal.getDomainQualifiedId());
            }
            else if (args.length == 2)
            {
                var domainId = args.shift();
                var principalId = args.shift();
                return this.readApplicationSettings("principal", domainId + "/" + principalId);
            }

        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type stack.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkSettingPermissions: function(checks, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/settings/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function() {
                callback.call(this, this.response["results"]);
            });
        },




        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION SESSIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction sessions.
         *
         * @param pagination
         *
         * @chained interaction session map
         */
        listInteractionSessions: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().interactionSessionMap(this);
            return this.chainGet(chainable, this.getUri() + "/insight/sessions", params);
        },

        /**
         * Reads an interaction session.
         *
         * @param interactionSessionId
         *
         * @chained interaction session
         */
        readInteractionSession: function(interactionSessionId)
        {
            var chainable = this.getFactory().interactionSession(this);
            return this.chainGet(chainable, this.getUri() + "/insight/sessions/" + interactionSessionId);
        },

        /**
         * Queries for interaction sessions.
         *
         * @chained interaction session map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionSessions: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/insight/sessions/query";
            };

            var chainable = this.getFactory().interactionSessionMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION PAGES
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction pages.
         *
         * @param pagination
         *
         * @chained interaction page map
         */
        listInteractionPages: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().interactionPageMap(this);
            return this.chainGet(chainable, this.getUri() + "/insight/pages", params);
        },

        /**
         * Reads an interaction page.
         *
         * @param interactionPageId
         *
         * @chained interaction page
         */
        readInteractionPage: function(interactionPageId)
        {
            var chainable = this.getFactory().interactionPage(this);
            return this.chainGet(chainable, this.getUri() + "/insight/pages/" + interactionPageId);
        },

        /**
         * Queries for interaction pages.
         *
         * @chained interaction page map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionPages: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/insight/pages/query";
            };

            var chainable = this.getFactory().interactionPageMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION NODES
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction nodes.
         *
         * @param pagination
         *
         * @chained interaction node map
         */
        listInteractionNodes: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().interactionNodeMap(this);
            return this.chainGet(chainable, this.getUri() + "/insight/nodes", params);
        },

        /**
         * Reads an interaction node.
         *
         * @param interactionNodeId
         *
         * @chained interaction node
         */
        readInteractionNode: function(interactionNodeId)
        {
            var chainable = this.getFactory().interactionNode(this);
            return this.chainGet(chainable, this.getUri() + "/insight/nodes/" + interactionNodeId);
        },

        /**
         * Queries for interaction nodes.
         *
         * @chained interaction node map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionNodes: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/insight/nodes/query";
            };

            var chainable = this.getFactory().interactionNodeMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION USERS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction users.
         *
         * @param pagination
         *
         * @chained interaction user map
         */
        listInteractionUsers: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().interactionUserMap(this);
            return this.chainGet(chainable, this.getUri() + "/insight/users", params);
        },

        /**
         * Reads an interaction user.
         *
         * @param interactionUserId
         *
         * @chained interaction user
         */
        readInteractionUser: function(interactionUserId)
        {
            var chainable = this.getFactory().interactionUser(this);
            return this.chainGet(chainable, this.getUri() + "/insight/users/" + interactionUserId);
        },

        /**
         * Queries for interaction users.
         *
         * @chained interaction user map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionUsers: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/insight/users/query";
            };

            var chainable = this.getFactory().interactionUserMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },


        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTION REPORTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interaction reports.
         *
         * @param pagination
         *
         * @chained interaction report map
         */
        listInteractionReports: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().interactionReportMap(this);
            return this.chainGet(chainable, this.getUri() + "/insight/reports", params);
        },

        /**
         * Reads an interaction report.
         *
         * @param interactionReportId
         *
         * @chained interaction report
         */
        readInteractionReport: function(interactionReportId)
        {
            var chainable = this.getFactory().interactionReport(this);
            return this.chainGet(chainable, this.getUri() + "/insight/reports/" + interactionReportId);
        },

        /**
         * Queries for interaction reports.
         *
         * @chained interaction report map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractionReports: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/insight/reports/query";
            };

            var chainable = this.getFactory().interactionReportMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        }

    });

})(window);
