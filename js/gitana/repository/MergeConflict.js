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
            return Gitana.TypedIDConstants.TYPE_RELEASE;
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

        resolve: function(resolution, callback)
        {
            var self = this;

            var uriFunction = function()
            {
                return self.getUri() + "/resolve";
            };

            var params = {
                "resolution": resolution
            };

            return this.chainPostResponse(this, uriFunction, params).then(function(response) {
                callback(response);
            });
        }

    });

})(window);
