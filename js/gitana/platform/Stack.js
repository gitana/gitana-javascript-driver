(function(window)
{
    Gitana = window.Gitana;
    
    Gitana.Stack = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Stack.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Stack
         *
         * @param {Gitana.Platform} platform
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.Stack"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_STACK;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/stacks/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().stack(this.getPlatform(), this);
        },

        getKey: function()
        {
            return this.get("key");
        },





        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // TEAMABLE
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Reads a team.
         *
         * @param teamKey
         *
         * @chainable team
         */
        readTeam: function(teamKey)
        {
            const uriFunction = function()
            {
                return this.getUri() + "/teams/" + teamKey;
            };

            const chainable = this.getFactory().team(this.getPlatform(), this);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Lists teams.
         *
         * @chainable map of teams
         */
        listTeams: function(pagination)
        {
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                return this.getUri() + "/teams";
            };

            const chainable = this.getFactory().teamMap(this.getCluster(), this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Creates a team.
         *
         * @param teamKey
         * @param object
         *
         * @chainable team
         */
        createTeam: function(teamKey, object)
        {
            if (!object)
            {
                object = {};
            }

            const uriFunction = function()
            {
                return this.getUri() + "/teams?key=" + teamKey;
            };

            const self = this;

            const chainable = this.getFactory().team(this.getPlatform(), this);
            return this.chainPostResponse(chainable, uriFunction, {}, object).then(function() {

                const chain = this;

                Chain(self).readTeam(teamKey).then(function() {
                    chain.handleResponse(this);
                    chain.next();
                });

                // we manually advance the chain
                return false;
            });
        },

        /**
         * Gets the owners team
         *
         * @chained team
         */
        readOwnersTeam: function()
        {
            return this.readTeam("owners");
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // END OF TEAMABLE
        //
        //////////////////////////////////////////////////////////////////////////////////////////




        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ROLE CONTAINER
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Reads a role.
         *
         * @param roleKeyOrId
         * @param inherited whether to check inherited role containers
         *
         * @chainable role
         */
        readRole: function(roleKeyOrId, inherited)
        {
            const params = {};

            if (inherited)
            {
                params.inherited = true;
            }

            const uriFunction = function()
            {
                return this.getUri() + "/roles/" + roleKeyOrId;
            };

            const chainable = this.getFactory().role(this.getCluster(), this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Lists roles.
         *
         * @param inherited whether to draw from inherited role containers
         *
         * @chainable map of roles
         */
        listRoles: function(inherited)
        {
            const params = {};

            if (inherited)
            {
                params.inherited = true;
            }

            const uriFunction = function()
            {
                return this.getUri() + "/roles";
            };

            const chainable = this.getFactory().roleMap(this.getCluster(), this);
            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Creates a role.
         *
         * @param roleKey
         * @param object
         *
         * @chainable role
         */
        createRole: function(roleKey, object)
        {
            if (!object)
            {
                object = {};
            }
            object.roleKey = roleKey;

            const uriFunction = function()
            {
                return this.getUri() + "/roles";
            };

            const self = this;

            const chainable = this.getFactory().role(this.getPlatform(), this, roleKey);
            return this.chainPostResponse(chainable, uriFunction, {}, object).then(function() {
                this.subchain(self).readRole(roleKey).then(function() {
                    Gitana.copyInto(chainable, this);
                });
            });
        },

        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // END OF ROLE CONTAINER
        //
        //////////////////////////////////////////////////////////////////////////////////////////






        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ATTACHMENTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Hands back an attachments map.
         *
         * @chained attachment map
         *
         * @param local
         *
         * @public
         */
        listAttachments: Gitana.Methods.listAttachments(),

        /**
         * Picks off a single attachment
         *
         * @chained attachment
         *
         * @param attachmentId
         */
        attachment: function(attachmentId)
        {
            return this.listAttachments().select(attachmentId);
        },

        /**
         * Creates an attachment.
         *
         * When using this method from within the JS driver, it really only works for text-based content such
         * as JSON or text.
         *
         * @chained attachment
         *
         * @param attachmentId (use null or false for default attachment)
         * @param contentType
         * @param data
         */
        attach: Gitana.Methods.attach(),

        /**
         * Deletes an attachment.
         *
         * @param attachmentId
         */
        unattach: Gitana.Methods.unattach(),

        /**
         * Generates a URI to a preview resource.
         */
        getPreviewUri: Gitana.Methods.getPreviewUri(),



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // LOGS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Queries for log entries.
         *
         * @chained log entry map
         *
         * @param {Object} query Query for finding log entries.
         * @param {Object} pagination pagination (optional)
         */
        queryLogEntries: function(query, pagination)
        {
            const self = this;
            const uriFunction = function()
            {
                return self.getUri() + "/logs/query";
            };

            if (!query)
            {
                query = {};
            }

            const chainable = this.getFactory().logEntryMap(this.getCluster());

            // prepare params (with pagination)
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Read a log entry.
         *
         * @chained log entry
         *
         * @param {String} logEntryId
         */
        readLogEntry: function(logEntryId)
        {
            const self = this;
            const uriFunction = function()
            {
                return self.getUri() + "/logs/" + logEntryId;
            };

            const chainable = this.getFactory().logEntry(this.getCluster());

            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Reads the last 100 lines of the log as text.
         * The callback receives the text as the argument.
         *
         * @param callback
         */
        readLog: function(callback)
        {

            const uriFunction = function () {
                return this.getUri() + "/logs/logfile";
            };

            return this.chainGetResponseText(this, uriFunction).then(function(text) {
                callback.call(this, text);
            });
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // STACK OPERATIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Assigns a data store to the stack
         * It takes datastore and key (optional) as input or a json object than contains
         * datastore type, id and key (optional)
         *
         * @chained this
         *
         * @param {Gitana.DataStore} datastore a platform datastore
         * @param {String} key optional key
         */
        assignDataStore: function(datastore, key)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/datastores/assign";
            };

            const args = Gitana.makeArray(arguments);

            let params;

            if (args.length === 1)
            {
                const arg = args.shift();

                if (arg.getType && arg.getId)
                {
                    params = {
                        "type": arg.getType(),
                        "id": arg.getId()
                    };
                }
                else
                {
                    params = arg;
                }
            }
            else
            {
                datastore = args.shift();
                key = args.shift();
                params = {
                    "type": datastore.getType(),
                    "id": datastore.getId()
                };

                if (key)
                {
                    params["key"] = key;
                }
            }

            return this.chainPostEmpty(null, uriFunction, params);
        },

        /**
         * Unassigns a data store from the stack
         *
         * @chained this
         *
         * @param {String} key optional key
         */
        unassignDataStore: function(key)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/datastores/unassign";
            };

            const params = {
                "key": key
            };

            return this.chainPostEmpty(null, uriFunction, params);

        },

        /**
         * Lists the data stores in this stack.
         *
         * @chained datastore map
         *
         * @param pagination
         */
        listDataStores: function(pagination)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/datastores";
            };

            const chainable = this.getFactory().platformDataStoreMap(this.getPlatform());

            // prepare params (with pagination)
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainGet(chainable, uriFunction, params);
        },

        /**
         * Lists the data stores in this stack.
         *
         * @chained datastore map
         *
         * @param {Object} query
         * @param {Object} pagination pagination (optional)
         */
        queryDataStores: function(query, pagination)
        {
            const self = this;

            // prepare params (with pagination)
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                return self.getUri() + "/datastores/query";
            };

            const chainable = this.getFactory().platformDataStoreMap(this.getPlatform());

            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Checks whether a datastore exists for the given key on this stack.
         * This passes the result (true/false) to the chaining function.
         *
         * @chained this
         *
         * @param {String} key the datastore key
         * @param {Function} callback
         */
        existsDataStore: function(key, callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/datastores/exists?key=" + key;
            };

            return this.chainPostResponse(this, uriFunction).then(function(response) {
                callback.call(this, response["exists"]);
            });
        },

        /**
         * Reads a data store for this stack by its key.
         *
         * @chained this
         *
         * @param {String} key the datastore key
         * @param [callback] a callback receiver to grab the actual typed object once retrieved
         */
        readDataStore: function(key, callback)
        {
            const self = this;

            return this.then(function() {

                const chain = this;

                Chain(self).queryDataStores().then(function() {

                    const datastore = this[key];
                    datastore["_doc"] = datastore["datastoreId"];
                    delete datastore["datastoreTypeId"];

                    if (callback)
                    {
                        callback.call(datastore);
                    }

                    chain.next();
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        }

    });

})(window);
