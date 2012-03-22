(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Interaction = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.Interaction.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class Interaction
         *
         * @param {Gitana.Application} application
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(interactionSession, object)
        {
            this.base(interactionSession.getApplication().getPlatform(), object);

            this.objectType = "Gitana.Interaction";


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
            this.getApplication = function() { return interactionSession.getApplication(); };

            /**
             * Gets the Gitana Application id.
             *
             * @inner
             *
             * @returns {String} The Gitana Application id
             */
            this.getApplicationId = function() { return interactionSession.getApplication().getId(); };

            /**
             * Gets the Interaction Session object.
             *
             * @inner
             *
             * @returns {Gitana.InteractionSession} The Gitana InteractionSession object
             */
            this.getInteractionSession = function() { return interactionSession; };

            /**
             * Gets the Interaction Session id.
             *
             * @inner
             *
             * @returns {String} The Gitana InteractionSession id
             */
            this.getInteractionSessionId = function() { return interactionSession.getId(); };
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/applications/" + this.getApplicationId() + "/insight/sessions/" + this.getInteractionSessionId() + "/interactions/" + this.getId();
        },




        //////////////////////////////////////////////////////////////////////////////////////////////
        //
        // METHODS
        //
        //////////////////////////////////////////////////////////////////////////////////////////////

        getInteractionSessionId: function()
        {
            return this.get("interactionSessionId");
        },

        getSourceUserAgent: function()
        {
            return this.object["source"]["user-agent"];
        },

        getSourceHost: function()
        {
            return this.object["source"]["host"];
        },

        getSourceIP: function()
        {
            return this.object["source"]["ip"];
        },

        getEventType: function()
        {
            return this.object["event"]["type"];
        },

        getEventX: function()
        {
            return this.object["event"]["x"];
        },

        getEventY: function()
        {
            return this.object["event"]["y"];
        },

        getEventOffsetX: function()
        {
            return this.object["event"]["offsetX"];
        },

        getEventOffsetY: function()
        {
            return this.object["event"]["offsetY"];
        },

        getApplicationHost: function()
        {
            return this.object["application"]["host"];
        },

        getApplicationUrl: function()
        {
            return this.object["application"]["url"];
        },

        getApplicationUri: function()
        {
            return this.object["application"]["uri"];
        },

        getElementId: function()
        {
            return this.object["element"]["id"];
        },

        getElementType: function()
        {
            return this.object["element"]["type"];
        },

        getElementPath: function()
        {
            return this.object["element"]["path"];
        },

        getNodeRepositoryId: function()
        {
            return this.object["node"]["repositoryId"];
        },

        getNodeId: function()
        {
            return this.object["node"]["nodeId"];
        },

        getTimestampStart: function()
        {
            return this.object["timestamp"]["start"];
        },

        getTimestampEnd: function()
        {
            return this.object["timestamp"]["end"];
        },

        getTimestampMs: function()
        {
            return this.object["timestamp"]["ms"];
        },

        getPrincipalDomainId: function()
        {
            return this.object["principal"]["domainId"];
        },

        getPrincipalId: function()
        {
            return this.object["principal"]["id"];
        }
    });

})(window);
