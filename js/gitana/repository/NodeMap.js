(function(window)
{
    const Gitana = window.Gitana;
    
    Gitana.NodeMap = Gitana.AbstractPlatformObjectMap.extend(
    /** @lends Gitana.NodeMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractPlatformObjectMap
         *
         * @class Map of node objects
         *
         * @param {Gitana.Branch} branch Gitana branch instance.
         * @param {Object} object
         */
        constructor: function(branch, object)
        {
            this.objectType = function() { return "Gitana.NodeMap"; };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // PRIVILEGED METHODS
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            /**
             * Gets the Gitana Repository object.
             *
             * @inner
             *
             * @returns {Gitana.Repository} The Gitana Repository object
             */
            this.getRepository = function() { return branch.getRepository(); };

            /**
             * Gets the Gitana Repository id.
             *
             * @inner
             *
             * @returns {String} The Gitana Repository id
             */
            this.getRepositoryId = function() { return branch.getRepository().getId(); };

            /**
             * Gets the Gitana Branch object.
             *
             * @inner
             *
             * @returns {Gitana.Branch} The Gitana Branch object
             */
            this.getBranch = function() { return branch; };

            /**
             * Gets the Gitana Branch id.
             *
             * @inner
             *
             * @returns {String} The Gitana Branch id
             */
            this.getBranchId = function() { return branch.getId(); };


            //////////////////////////////////////////////////////////////////////////////////////////////
            //
            // CALL THROUGH TO BASE CLASS (at the end)
            //
            //////////////////////////////////////////////////////////////////////////////////////////////

            this.base(branch.getPlatform(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().nodeMap(this.getBranch(), this);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().node(this.getBranch(), json);
        },

        /**
         * Delete
         *
         * @chained this
         *
         * @public
         */
        del: function()
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getBranch().getUri() + "/nodes/delete";
            };

            return this.subchain().then(function() {

                const nodeIds = this.__keys();

                return this.chainPost(this, uriFunction, {}, {
                    "_docs": nodeIds
                });
            });
        }

    });

})(window);
