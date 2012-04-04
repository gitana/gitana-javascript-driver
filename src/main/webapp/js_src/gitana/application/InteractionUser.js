(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionUser = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.InteractionUser.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class InteractionUser
         *
         * @param {Gitana.Application} application
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(application, object)
        {
            this.base(application.getPlatform(), object);

            this.objectType = "Gitana.InteractionUser";


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
            return "/applications/" + this.getApplicationId() + "/insight/users/" + this.getId();
        },

        getKey: function()
        {
            return this.get("key");
        },

        getDomainId: function()
        {
            return this.get("domainId");
        },

        getPrincipalId: function()
        {
            return this.get("principalId");
        },



        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // INTERACTIONS
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the interactions.
         *
         * @param pagination
         *
         * @chained interaction map
         */
        listInteractions: function(pagination)
        {
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().interactionMap(this);
            return this.chainGet(chainable, this.getUri() + "/interactions", params);
        },

        /**
         * Reads an interaction.
         *
         * @param interactionId
         *
         * @chained interaction
         */
        readInteraction: function(interactionId)
        {
            var chainable = this.getFactory().interaction(this);
            return this.chainGet(chainable, this.getUri() + "/interactions/" + interactionId);
        },

        /**
         * Queries for interactions.
         *
         * @chained interaction map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryInteractions: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/interactions/query";
            };

            var chainable = this.getFactory().interactionMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        }

    });

})(window);
