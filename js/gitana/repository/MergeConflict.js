(function(window)
{
    var Gitana = window.Gitana;

    Gitana.MergeConflict = Gitana.AbstractRepositoryObject.extend(
    /** @lends Gitana.MergeConflict.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractRepositoryObject
         *
         * @class MergeConflict
         *
         * @param {Gitana.Repository} repository
         * @param [Object] object json object (if no callback required for populating)
         */
        constructor: function(repository, object)
        {
            this.base(repository, object);

            this.objectType = function() { return "Gitana.MergeConflict"; };
        },

        /**
         * @OVERRIDE
         */
        getType: function()
        {
            return Gitana.TypedIDConstants.TYPE_MERGE_CONFLICT;
        },

        /**
         * @OVERRIDE
         */
        getUri: function()
        {
            return "/repositories/" + this.getRepositoryId() + "/conflicts/" + this.getId();
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().mergeConflict(this.getRepository(), this);
        },

        resolve: function(resolutionsArrayOrString, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/resolve";
            };

            var params = {};
            var payload = null;

            if (Gitana.isString(resolutionsArrayOrString))
            {
                params.resolution = resolutionsArrayOrString;
            }
            else if (Gitana.isArray(resolutionsArrayOrString))
            {
                payload = {
                    "resolutions": resolutionsArrayOrString
                };
            }

            return this.chainPostResponse(this, uriFunction, params, payload).then(function(response) {
                callback(response);
            });
        },

        commit: function(branchId)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/commit";
            };

            var params = {};
            if (branchId) {
                params.branch = branchId;
            }

            return this.chainPost(this, uriFunction, params);
        }

    });

})(window);
