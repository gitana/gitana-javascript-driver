(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.AbstractRegistrarObject = Gitana.AbstractPlatformObject.extend(
    /** @lends Gitana.AbstractRegistrarObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObject
         *
         * @class AbstractRegistrarObject
         *
         * @param {Gitana.Registrar} registrar
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(registrar, object)
        {
            this.base(registrar.getPlatform(), object);

            this.objectType = function() { return "Gitana.Meter"; };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.getRegistrar = function()
            {
                return registrar;
            };

            this.getRegistrarId = function()
            {
                return registrar.getId();
            };
        },

        /**
         * @OVERRIDE
         */
        ref: function()
        {
            return this.getType() + "://" + this.getPlatformId() + "/" + this.getRegistrarId() + "/" + this.getId();
        }

    });

})(window);
