(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.InteractionMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.InteractionMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class InteractionMap
         *
         * @param {Gitana.Application} interactionSession Gitana interaction session instance
         * @param [Object] object
         */
        constructor: function(interactionSession, object)
        {
            this.objectType = "Gitana.InteractionMap";


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


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(interactionSession.getApplication().getPlatform(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().interactionMap(this.getInteractionSession(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().interaction(this.getInteractionSession(), json);
        }

    });

})(window);
