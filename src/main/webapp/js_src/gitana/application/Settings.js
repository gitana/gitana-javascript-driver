(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Settings = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Settings.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Settings
         *
         * @param {Gitana.Application} application
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(application, object)
        {
            this.base(application.getPlatform(), object);

            this.objectType = "Gitana.Settings";

            this.systemKeys = ["key","scope","_system","_doc","title","description"];

            this.rootKey = "settings";

            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Application object.
             *
             * @inner
             *
             * @returns {Gitana.Application} The Gitana Application object
             */
            this.getApplication = function() { return application; };

            /**
             * Gets the Gitana Application id.
             *
             * @inner
             *
             * @returns {String} The Gitana Application id
             */
            this.getApplicationId = function() { return application.getId(); };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_SETTINGS;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/applications/" + this.getApplicationId() + "/settings/" + this.getId();
        },

        /**
         * Returns all settings.
         */
        getSettings: function()
        {
            /*
            var settings = {};

            Gitana.copyInto(settings, this.object);
            
            for (var i = 0; i < this.systemKeys.length; i++)
            {
                var key = this.systemKeys[i];
                if (settings[key] != null) 
                {
                    delete settings[key];    
                }
            }
            return settings;
            */
            return this.get(this.rootKey);
        },

        /**
         * Gets setting by key.
         * @param key Setting key
         */
        getSetting: function(key)
        {            
            //return this.get(key);
            return this.getSettings() != null ? this.getSettings()[key] : null;
        },

        /**
         * Sets setting.
         * 
         * @param key Setting key
         * @param val Setting value
         */
        setSetting: function(key, val)
        {            
            /*
            if (key != null && !Gitana.contains(this.systemKeys,key) )
            {
                this.object[key] = val;
            }
            */
            if (this.getSettings() == null)
            {
                this.object[this.rootKey] = {};
                this.object[this.rootKey][key] = val;
            }
            else
            {
               this.getSettings()[key] = val;
            }
        },         

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
        listAttachments: function(local)
        {
            var self = this;

            var attachmentMap = new Gitana.BinaryAttachmentMap(this);

            var result = this.subchain(attachmentMap);

            if (!local)
            {
                // front-load some work that fetches from remote server
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
            }
            else
            {
                // try to populate the map from our cached values on the node (if they exist)
                var existingMap = this.getSystemMetadata()._system.attachments;

                var map = {};
                Gitana.copyInto(map, existingMap);

                attachmentMap.handleMap(map);
            }

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
