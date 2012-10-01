(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.SystemMetadata = Base.extend(
    /** @lends Gitana.SystemMetadata.prototype */
    {
        /**
         * @constructs
         *
         * @class System Metadata
         */
        constructor: function()
        {
            this.base();

            this._system = {};
        },

        updateFrom: function(json)
        {
            // clear old system properties
            for (var i in this._system) {
                if (this._system.hasOwnProperty(i)) {
                    delete this._system[i];
                }
            }

            Gitana.copyInto(this._system, json);
        },

        get: function(key)
        {
            return this._system[key];
        },

        /**
         * Retrieves the changeset id.
         *
         * @public
         *
         * @return the changeset id
         */
        getChangesetId: function()
        {
            return this.get("changeset");
        },

        /**
         * Retrieves the name of the user who created this object.
         *
         * @public
         *
         * @return the user name of the creator
         */
        getCreatedBy: function()
        {
            return this.get("created_by");
        },

        /**
         * Retrieves the id of the user who created this object.
         *
         * @public
         *
         * @return the user id of the creator
         */
        getCreatedByPrincipalId: function()
        {
            return this.get("created_by_principal_id");
        },

        /**
         * Retrieves the domain id of the user who created this object.
         *
         * @public
         *
         * @return the user domain id of the creator
         */
        getCreatedByPrincipalDomainId: function()
        {
            return this.get("created_by_principal_domain_id");
        },

        /*
        readCreatedByPrincipal: function(platform)
        {
            return this.subchain(platform).readDomain(this.getCreatedByPrincipalDomainId).readPrincipal(this.getCreatedByPrincipalId);
        },
        */

        /**
         * Retrieves the id of the user who modified this object.
         *
         * @public
         *
         * @return the user id of the modifier
         */
        getModifiedBy: function()
        {
            return this.get("modified_by");
        },

        /**
         * Retrieves the id of the user who modified this object.
         *
         * @public
         *
         * @return the user id of the modifier
         */
        getModifiedByPrincipalId: function()
        {
            return this.get("modified_by_principal_id");
        },

        /**
         * Retrieves the domain id of the user who modified this object.
         *
         * @public
         *
         * @return the user domain id of the modifier
         */
        getModifiedByPrincipalDomainId: function()
        {
            return this.get("modified_by_principal_domain_id");
        },

        /*
        readModifiedByPrincipal: function(platform)
        {
            return this.subchain(platform).readDomain(this.getModifiedByPrincipalDomainId).readPrincipal(this.getModifiedByPrincipalId);
        },
        */

        /**
         * Retrieves the timestamp for creation of this object.
         *
         * @public
         *
         * @return creation timestamp
         */
        getCreatedOn: function()
        {
            if (!this.createdOn)
            {
                this.createdOn = new Gitana.Timestamp(this.get("created_on"));
            }

            return this.createdOn;
        },

        /**
         * Retrieves the timestamp for modification of this object.
         *
         * @public
         *
         * @return modification timestamp
         */
        getModifiedOn: function()
        {
            if (!this.modifiedOn)
            {
                this.modifiedOn = new Gitana.Timestamp(this.get("modified_on"));
            }

            return this.modifiedOn;
        }
        
    });
    
})(window);
