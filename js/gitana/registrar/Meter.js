(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.Meter = Gitana.AbstractRegistrarObject.extend(
    /** @lends Gitana.Meter.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractRegistrarObject
         *
         * @class Meter
         *
         * @param {Gitana.Registrar} registrar
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(registrar, object)
        {
            this.base(registrar, object);

            this.objectType = function() { return "Gitana.Meter"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_PLAN;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/registrars/" + this.getRegistrarId() + "/meters/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().meter(this.getRegistrar(), this);
        }

    });

    // constants

    // tenant information
    Gitana.Meter.FIELD_TENANT_ID = "tenantId";

    // meter data
    Gitana.Meter.FIELD_METER_TYPE = "meterType";
    Gitana.Meter.FIELD_METER_START = "meterStart"; // timestamp
    Gitana.Meter.FIELD_METER_END = "meterEnd"; // timestamp

    // bytes
    Gitana.Meter.FIELD_MAX_BYTE_COUNT = "maxByteCount";
    Gitana.Meter.FIELD_RAW_BYTE_COUNT = "rawByteCount"; // raw count (all bytes counter)
    Gitana.Meter.FIELD_RAW_BYTE_COUNT_PERCENTAGE = "rawByteCountPercentage";
    Gitana.Meter.FIELD_UNPROCESSED_BYTE_COUNT = "unprocessedByteCount"; // waiting to be processed
    Gitana.Meter.FIELD_BILLABLE_BYTE_COUNT = "billableByteCount";
    Gitana.Meter.FIELD_BILLABLE_BYTE_COUNT_PERCENTAGE = "billableByteCountPercentage";

    // objects
    Gitana.Meter.FIELD_MAX_OBJECT_COUNT = "maxObjectCount";
    Gitana.Meter.FIELD_RAW_OBJECT_COUNT = "rawObjectCount"; // raw count (all objects counter)
    Gitana.Meter.FIELD_RAW_OBJECT_COUNT_PERCENTAGE = "rawObjectCountPercentage";
    Gitana.Meter.FIELD_UNPROCESSED_OBJECT_COUNT = "unprocessedObjectCount";
    Gitana.Meter.FIELD_BILLABLE_OBJECT_COUNT = "billableObjectCount";
    Gitana.Meter.FIELD_BILLABLE_OBJECT_COUNT_PERCENTAGE = "billableObjectCountPercentage";

})(window);
