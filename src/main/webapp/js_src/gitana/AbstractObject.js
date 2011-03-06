(function(window)
{
    var Gitana = window.Gitana;

    /**
     * Abstract class that provides helper functions for json objects.
     */
    Gitana.AbstractObject = Gitana.Abstract.extend(
    {
        constructor: function(object)
        {
            this.base();
            
            // copy object properties into this object
            // this skips methods
            this.copyInto(this, object);
        },

        stringify: function(pretty)
        {
            return this.buildString(this, pretty);
        }

    });

})(window);
