(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Timestamp = Gitana.AbstractObject.extend(
    /** @lends Gitana.Timestamp.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Timestamp
         *
         * @param {Object} object the timestamp json object
         */
        constructor: function(object)
        {
            this.base(object);
        },

        getYear: function()
        {
            return this["year"];
        },

        getMonth: function()
        {
            return this["month"];
        },

        getDay: function()
        {
            return this["day_of_month"];
        },

        getHour: function()
        {
            return this["hour"];
        },

        getMinute: function()
        {
            return this["minute"];
        },

        getSecond: function()
        {
            return this["second"];
        },

        getMillisecond: function()
        {
            return this["millisecond"];
        },

        getTimestamp: function()
        {
            return this["timestamp"];
        }
    });
    
})(window);
