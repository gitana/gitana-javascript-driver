(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.PageRendition = Gitana.AbstractApplicationObject.extend(
    /** @lends Gitana.PageRendition.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractApplicationObject
         *
         * @class PageRendition
         *
         * @param {Gitana.Application} application
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(application, object)
        {
            this.base(application, object);

            this.objectType = function() { return "Gitana.PageRendition"; };
        },

        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.PageRendition(this.getApplication(), this);
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_PAGE_RENDITION;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/applications/" + this.getApplicationId() + "/deployments/" + this.deploymentKey + "/pagerenditions/" + this.key;
        },

        /**
         * Invalidate
         *
         * @chained this
         *
         * @public
         */
        invalidate: function()
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/invalidate";
            };

            // NOTE: pass control back to the server instance
            return this.chainPostEmpty(this, uriFunction);
        }

    });

})(window);
