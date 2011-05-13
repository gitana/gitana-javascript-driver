(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Timestamp = Base.extend(
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

        /**
         * @returns {Integer} the year
         */
        getYear: function()
        {
            return this["year"];
        },

        /**
          @returns {Integer} the month
         */
        getMonth: function()
        {
            return this["month"];
        },

        /**
         * @returns {Integer} the day of the month
         */
        getDay: function()
        {
            return this["day_of_month"];
        },

        /**
         * @returns {Integer} the hour of the day (24 hour clock)
         */
        getHour: function()
        {
            return this["hour"];
        },

        /**
         * @returns {Integer} the minute
         */
        getMinute: function()
        {
            return this["minute"];
        },

        /**
         * @returns {Integer} the second
         */
        getSecond: function()
        {
            return this["second"];
        },

        /**
         * @returns {Integer} the millisecond (0-1000)
         */
        getMillisecond: function()
        {
            return this["millisecond"];
        },

        /**
         * @returns {Integer} absolute millisecond
         */
        getTime: function()
        {
            return this["ms"];
        },

        /**
         * @returns {String} text-friendly timestamp
         */
        getTimestamp: function()
        {
            return this["timestamp"];
        }
    });
    
})(window);
