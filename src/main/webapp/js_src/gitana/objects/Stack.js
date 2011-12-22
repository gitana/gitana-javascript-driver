(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Stack = Gitana.AbstractSelfableACLObject.extend(
    /** @lends Gitana.Stack.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
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

            var chainable = this.getFactory().teamMap(this.getPlatform(), this);
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
        }

    });

})(window);
