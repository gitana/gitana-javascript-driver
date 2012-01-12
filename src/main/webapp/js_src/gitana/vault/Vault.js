(function(window)
{
    var Gitana = window.Gitana;
    
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
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(platform, object)
        {
            this.base(platform, object);

            this.objectType = "Gitana.Vault";
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/vaults/" + this.getId();
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return "vault";
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().vault(this.getPlatform(), this.object);
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
            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var chainable = this.getFactory().archiveMap(this);
            return this.chainGet(chainable, this.getUri() + "/archives", params);
        },

        /**
         * Reads an archive.
         *
         * @param stackId
         *
         * @chained stack
         */
        readArchive: function(archiveId)
        {
            var chainable = this.getFactory().stack(this);
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
            var chainable = this.getFactory().stack(this);
            return this.chainGet(chainable, this.getUri() + "/archives/lookup?group=" + groupId + "&artifact=" + artifactId + "&version=" + versionId);
        },

        /**
         * Queries for stacks.
         *
         * @chained stack map
         *
         * @param {Object} query
         * @param [Object] pagination pagination (optional)
         */
        queryArchives: function(query, pagination)
        {
            var self = this;

            var params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            var uriFunction = function()
            {
                return self.getUri() + "/archives/query";
            };

            var chainable = this.getFactory().archiveMap(this);
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
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/archives/permissions/check";
            };

            var object = {
                "checks": checks
            };

            return this.chainPostResponse(this, uriFunction, {}, object).then(function() {
                callback.call(this, this.response["results"]);
            });
        }
    });

})(window);
