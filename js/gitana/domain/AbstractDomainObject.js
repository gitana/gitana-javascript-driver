(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.AbstractDomainObject = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.AbstractDomainObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class AbstractDomainObject
         *
         * @param {Gitana.Domain} domain
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(domain, object)
        {
            this.base(domain.getPlatform(), object);

            this.objectType = function() { return "Gitana.DomainPrincipal"; };



            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Domain object.
             *
             * @inner
             *
             * @returns {Gitana.Domain} The Gitana Domain object
             */
            this.getDomain = function() { return domain; };

            /**
             * Gets the Gitana Domain id.
             *
             * @inner
             *
             * @returns {String} The Gitana Domain id
             */
            this.getDomainId = function() { return domain.getId(); };
        },

        /**
         * @OVERRIDE
         */
        ref: function()
        {
            return this.getType() + "://" + this.getPlatformId() + "/" + this.getDomainId() + "/" + this.getId();
        }

    });

})(window);
