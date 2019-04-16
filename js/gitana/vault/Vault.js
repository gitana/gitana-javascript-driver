(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.Vault = Gitana.AbstractPlatformDataStore.extend(
    /** @lends Gitana.Vault.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformDataStore
         *
         * @class Vault
         *
         * @param {Gitana.Platform} platform
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = function() { return "Gitana.Vault"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_VAULT;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/vaults/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().vault(this.getPlatform(), this);
        },




        //////////////////////////////////////////////////////////////////////////////////////////
        //
        // ARCHIVES
        //
        //////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Lists the archives.
         *
         * @param pagination
         *
         * @chained archive map
         */
        listArchives: function(pagination)
        {
            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const chainable = this.getFactory().archiveMap(this);
            return this.chainGet(chainable, this.getUri() + "/archives", params);
        },

        /**
         * Reads an archive.
         *
         * @param archiveId
         *
         * @chained stack
         */
        readArchive: function(archiveId)
        {
            const chainable = this.getFactory().archive(this);
            return this.chainGet(chainable, this.getUri() + "/archives/" + archiveId);
        },

        /**
         * Looks up an archive by its identifier information.
         *
         * @param groupId
         * @param artifactId
         * @param versionId
         *
         * @chained stack
         */
        lookupArchive: function(groupId, artifactId, versionId)
        {
            const chainable = this.getFactory().archive(this);
            return this.chainGet(chainable, this.getUri() + "/archives/lookup?group=" + groupId + "&artifact=" + artifactId + "&version=" + versionId);
        },

        /**
         * Queries for stacks.
         *
         * @chained stack map
         *
         * @param {Object} query
         * @param {Object} pagination pagination (optional)
         */
        queryArchives: function(query, pagination = undefined)
        {
            const self = this;

            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                return self.getUri() + "/archives/query";
            };

            const chainable = this.getFactory().archiveMap(this);
            return this.chainPost(chainable, uriFunction, params, query);
        },

        /**
         * Performs a bulk check of permissions against permissioned objects of type stack.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "permissionId": "<permissionId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkArchivePermissions: function(checks, callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/archives/permissions/check";
            };

            const object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        },

        /**
         * Performs a bulk check of authorities against permissioned objects of type stack.
         *
         * Example of checks array:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>"
         * }]
         *
         * The callback receives an array of results, example:
         *
         * [{
         *    "permissionedId": "<permissionedId>",
         *    "principalId": "<principalId>",
         *    "authorityId": "<authorityId>",
         *    "result": true
         * }]
         *
         * The order of elements in the array will be the same for checks and results.
         *
         * @param checks
         * @param callback
         */
        checkArchiveAuthorities: function(checks, callback)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/archives/authorities/check";
            };

            const object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function(response) {
                callback.call(this, response["results"]);
            });
        }

    });

})(window);
