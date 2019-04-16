(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.Message = Gitana.AbstractApplicationObject.extend(
    /** @lends Gitana.Message.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractApplicationObject
         *
         * @class Message
         *
         * @param {Gitana.Application} application
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(application, object)
        {
            this.base(application, object);

            this.objectType = function() { return "Gitana.Message"; };
        },

        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.Message(this.getApplication(), this);
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_MESSAGE;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/applications/" + this.getApplicationId() + "/messages/" + this.getId();
        }

    });

})(window);
