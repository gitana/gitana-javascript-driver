(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Project = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Project.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Project
         *
         * @param {Gitana.Platform} platform
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.Project"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_PROJECT;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/projects/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().project(this.getPlatform(), this);
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
        getPreviewUri: Gitana.Methods.getPreviewUri(),

        /**
         * Reads the stack for the project, if it exists.
         *
         * @chained stack
         */
        readStack: function()
        {
            return this.subchain(this.getPlatform()).readStack(this["stackId"]);
        },

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // ADMIN
        //
        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        adminMaintenance: function()
        {
            var self = this;

            return this.then(function() {

                var chain = this;

                // call
                var uri = self.getUri() + "/admin/maintenance";
                self.getDriver().gitanaPost(uri, null, {}, function(response) {
                    chain.next();
                });

                // NOTE: we return false to tell the chain that we'll manually call next()
                return false;
            });
        }

    });

})(window);
