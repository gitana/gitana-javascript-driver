(function(window)
{
    Gitana = window.Gitana;
    
    Gitana.Settings = Gitana.AbstractApplicationObject.extend(
    /** @lends Gitana.Settings.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractApplicationObject
         *
         * @class Settings
         *
         * @param {Gitana.Application} application
         * @param {Object}object json object (if no callback required for populating)
         */
        constructor: function(application, object)
        {
            this.base(application, object);

            this.objectType = function() { return "Gitana.Settings"; };
        },

        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.Settings(this.getApplication(), this);
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
            return this["settings"];
        },

        /**
         * Gets setting by key.
         * @param key Setting key
         */
        getSetting: function(key)
        {
            return (this.getSettings() ? this.getSettings()[key] : null);
        },

        /**
         * Sets setting.
         * 
         * @param key Setting key
         * @param val Setting value
         */
        setSetting: function(key, val)
        {
            if (!this.getSettings())
            {
                this["settings"] = {};
            }

            this["settings"][key] = val;
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
        getPreviewUri: Gitana.Methods.getPreviewUri()

    });

})(window);
