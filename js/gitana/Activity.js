(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.Activity = Gitana.AbstractObject.extend(
    /** @lends Gitana.Activity.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractObject
         *
         * @class Activity
         *
         * @param {Gitana.DataStore} datastore
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(datastore, object)
        {
            this.base(datastore.getDriver(), object);

            this.objectType = function() { return "Gitana.Activity"; };

            this.getDataStore = function()
            {
                return datastore;
            };
        },

        getUri: function()
        {
            return this.getDataStore().getUri() + "/activities/" + this.getId();
        },

        /**
         * Delete
         *
         * @chained datastore
         *
         * @public
         */
        del: function()
        {
            var uriFunction = function()
            {
                return this.getUri();
            };

            // NOTE: pass control back to the datastore
            return this.chainDelete(this.getDataStore(), uriFunction);
        },

        /**
         * Reload
         *
         * @chained security group
         *
         * @public
         */
        reload: function()
        {
            var uriFunction = function()
            {
                return this.getUri();
            };

            return this.chainReload(this.clone(), uriFunction);
        },

        /**
         * Update
         *
         * @chained security group
         *
         * @public
         */
        update: function()
        {
            var uriFunction = function()
            {
                return this.getUri();
            };

            return this.chainUpdate(this.clone(), uriFunction);
        },


        //////////////////////////////////////////////////////////////////////////////////////
        //
        // ACCESSORS
        //
        //////////////////////////////////////////////////////////////////////////////////////

        getType: function()
        {
            return this.get("type");
        },

        getTimestamp: function()
        {
            return this.get("timestamp");
        },


        // user

        getUserDomainId: function()
        {
            return this.get("userDomainId");
        },

        getUserId: function()
        {
            return this.get("userId");
        },

        getUserTitle: function()
        {
            return this.get("userTitle");
        },

        getUserEmail: function()
        {
            return this.get("userEmail");
        },

        getUserName: function()
        {
            return this.get("userName");
        },


        // object

        getObjectDataStoreTypeId: function()
        {
            return this.get("objectDatastoreTypeId");
        },

        getObjectDataStoreId: function()
        {
            return this.get("objectDatastoreId");
        },

        getObjectDataStoreTitle: function()
        {
            return this.get("objectDatastoreTitle");
        },

        getObjectTypeId: function()
        {
            return this.get("objectTypeId");
        },

        getObjectId: function()
        {
            return this.get("objectId");
        },

        getObjectTitle: function()
        {
            return this.get("objectTitle");
        },


        // other

        getOtherDataStoreTypeId: function()
        {
            return this.get("otherDatastoreTypeId");
        },

        getOtherDataStoreId: function()
        {
            return this.get("otherDatastoreId");
        },

        getOtherDataStoreTitle: function()
        {
            return this.get("otherDatastoreTitle");
        },

        getOtherTypeId: function()
        {
            return this.get("otherTypeId");
        },

        getOtherId: function()
        {
            return this.get("otherId");
        },

        getOtherTitle: function()
        {
            return this.get("otherTitle");
        }

    });

})(window);
