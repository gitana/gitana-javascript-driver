(function(window)
{
    var Gitana = window.Gitana;
    
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
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = "Gitana.Stack";
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
            return this.getFactory().stack(this.getPlatform(), this.object);
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
            var uriFunction = function()
            {
                return this.getUri() + "/teams/" + teamKey;
            };

            var chainable = this.getFactory().team(this.getPlatform(), this, teamKey);
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Lists teams.
         *
         * @chainable map of teams
         */
        listTeams: function()
        {
            var uriFunction = function()
            {
                return this.getUri() + "/teams";
            };

            var chainable = this.getFactory().teamMap(this.getCluster(), this);
            return this.chainGet(chainable, uriFunction);
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

            var uriFunction = function()
            {
                return this.getUri() + "/teams?key=" + teamKey;
            };

            var self = this;

            var chainable = this.getFactory().team(this.getPlatform(), this, teamKey);
            return this.chainPostResponse(chainable, uriFunction, {}, object).then(function() {
                this.subchain(self).readTeam(teamKey).then(function() {
                    Gitana.copyInto(chainable.object, this.object);
                });
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
        // ATTACHMENTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Hands back an attachments map.
         *
         * @chained attachment map
         *
         * @public
         */
        listAttachments: function()
        {
            var self = this;

            var attachmentMap = new Gitana.BinaryAttachmentMap(this);

            var result = this.subchain(attachmentMap);
            result.subchain().then(function() {

                var chain = this;

                self.getDriver().gitanaGet(self.getUri() + "/attachments", null, function(response) {

                    var map = {};
                    for (var i = 0; i < response.rows.length; i++)
                    {
                        map[response.rows[i]["_doc"]] = response.rows[i];
                    }
                    attachmentMap.handleMap(map);

                    chain.next();
                });

                return false;
            });

            return result;
        },

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
        attach: function(attachmentId, contentType, data)
        {
            var self = this;

            // the thing we're handing back
            var result = this.subchain(new Gitana.BinaryAttachment(this, attachmentId));

            // preload some work onto a subchain
            result.subchain().then(function() {

                // upload the attachment
                var uploadUri = self.getUri() + "/attachments/" + attachmentId;
                this.chainUpload(this, uploadUri, null, contentType, data).then(function() {

                    // read back attachment information and plug onto result
                    this.subchain(self).listAttachments().select(attachmentId).then(function() {
                        result.handleAttachment(this.attachment);
                    });
                });
            });

            return result;
        },

        /**
         * Deletes an attachment.
         *
         * @param attachmentId
         */
        unattach: function(attachmentId)
        {
            return this.subchain().then(function() {

                this.chainDelete(this, this.getUri() + "/attachments/" + attachmentId).then(function() {

                    // TODO

                });
            });
        },



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
         * @param [Object] pagination pagination (optional)
         */
        queryLogEntries: function(query, pagination)
        {
            var self = this;
            var uriFunction = function()
            {
                return self.getUri() + "/logs/query";
            };

            if (!query)
            {
                query = {};
            }

            var chainable = this.getFactory().logEntryMap(this.getCluster());

            // prepare params (with pagination)
            var params = {};
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
         * @param {String} jobId
         */
        readLogEntry: function(logEntryId)
        {
            var self = this;
            var uriFunction = function()
            {
                return self.getUri() + "/logs/" + logEntryId;
            };

            var chainable = this.getFactory().logEntry(this.getCluster());

            return this.chainGet(chainable, uriFunction);
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // STACK OPERATIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Assigns a data store to the stack
         *
         * @chained this
         *
         * @param {Gitana.DataStore} datastore a platform datastore
         * @param {String} key optional key
         */
        assignDataStore: function(datastore, key)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/datastores/assign";
            };

            var params = {
                "type": datastore.getType(),
                "id": datastore.getId()
            };

            if (key)
            {
                params[key] = key;
            }

            return this.chainPostEmpty(this, uriFunction, params);
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
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/datastores/unassign";
            };

            var params = {
                "key": key
            };

            return this.chainPostEmpty(this, uriFunction, params);

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
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/datastores";
            };

            var chainable = this.getFactory().platformDataStoreMap(this.getPlatform());

            // prepare params (with pagination)
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            return this.chainGet(chainable, uriFunction, params);
        }


    });

})(window);
