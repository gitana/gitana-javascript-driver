(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionReportEntry = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.InteractionReportEntry.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class InteractionReportEntry
         *
         * @param {Gitana.Application} application
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(application, object)
        {
            this.base(application.getPlatform(), object);

            this.objectType = "Gitana.InteractionReportEntry";


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
        getUri: function()
        {
            return "/applications/" + this.getApplicationId() + "/insight/reports/" + this.getReportId() + "/entries/" + this.getId();
        },

        getReportId: function()
        {
            return this.get("reportId");
        },

        getKey: function()
        {
            return this.get("key");
        },

        getApplicationId: function()
        {
            return this.get("applicationId");
        },

        getApplicationTitle: function()
        {
            return this.get("applicationTitle");
        },

        getApplicationDescription: function()
        {
            return this.get("applicationDescription");
        },

        getSessionId: function()
        {
            return this.get("sessionId");
        },

        getSessionTitle: function()
        {
            return this.get("sessionTitle");
        },

        getSessionDescription: function()
        {
            return this.get("sessionDescription");
        },

        getPageId: function()
        {
            return this.get("pageId");
        },

        getPageUri: function()
        {
            return this.get("pageUri");
        },

        getPageTitle: function()
        {
            return this.get("pageTitle");
        },

        getPageDescription: function()
        {
            return this.get("pageDescription");
        },

        getNodeId: function()
        {
            return this.get("nodeId");
        },

        getNodeTargetRepositoryId: function()
        {
            return this.get("nodeTargetRepositoryId");
        },

        getNodeTargetBranchId: function()
        {
            return this.get("nodeTargetBranchId");
        },

        getNodeTargetId: function()
        {
            return this.get("nodeTargetId");
        },

        getNodeTitle: function()
        {
            return this.get("nodeTitle");
        },

        getNodeDescription: function()
        {
            return this.get("nodeDescription");
        },

        getUserId: function()
        {
            return this.get("userId");
        },

        getUserTitle: function()
        {
            return this.get("userTitle");
        },

        getUserDescription: function()
        {
            return this.get("userDescription");
        },

        getUserFirstName: function()
        {
            return this.get("userFirstName");
        },

        getUserLastName: function()
        {
            return this.get("userLastName");
        },

        getUserEmail: function()
        {
            return this.get("userEmail");
        },

        getUserName: function()
        {
            return this.get("userName");
        }

    });

})(window);
