(function(window)
{
    var Gitana = window.Gitana;

    Gitana.AbstractObject = Gitana.Abstract.extend(
    /** @lends Gitana.AbstractObject.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Abstract
         *
         * @class Abstract base class for all driver objects.
         *
         * @param {Object} object Object.
         */
        constructor: function(object)
        {
            this.base();
            
            // copy object properties into this object
            // this skips methods
            this.copyInto(this, object);
        },

        /**
         * Builds a string representation of this object.
         *
         * @public
         * 
         * @param {Boolean} [pretty] Whether to indent.  Defaults to false.
         *
         * @returns {String} String representation of the object.
         */
        stringify: function(pretty)
        {
            return this.buildString(this, pretty);
        }

    });

})(window);
