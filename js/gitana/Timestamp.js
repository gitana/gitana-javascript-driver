(function(window)
{
    Gitana = window.Gitana;
    
    Gitana.Timestamp = Base.extend(
    /** @lends Gitana.Timestamp.prototype */
    {
        /**
         * @constructs
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
         * @returns {number} the year
         */
        getYear: function()
        {
            return this["year"];
        },

        /**
          @returns {number} the month
         */
        getMonth: function()
        {
            return this["month"];
        },

        /**
         * @returns {number} the day of the month
         */
        getDay: function()
        {
            return this["day_of_month"];
        },

        /**
         * @returns {number} the hour of the day (24 hour clock)
         */
        getHour: function()
        {
            return this["hour"];
        },

        /**
         * @returns {number} the minute
         */
        getMinute: function()
        {
            return this["minute"];
        },

        /**
         * @returns {number} the second
         */
        getSecond: function()
        {
            return this["second"];
        },

        /**
         * @returns {number} the millisecond (0-1000)
         */
        getMillisecond: function()
        {
            return this["millisecond"];
        },

        /**
         * @returns {number} absolute millisecond
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
