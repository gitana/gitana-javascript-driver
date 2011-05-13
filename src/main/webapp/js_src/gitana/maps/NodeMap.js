(function(window)
{
    var Gitana = window.Gitana;
    
    Gitana.NodeMap = Gitana.AbstractMap.extend(
    /** @lends Gitana.NodeMap.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.AbstractMap
         *
         * @class Map of node objects
         *
         * @param {Gitana.Server} server Gitana server instance.
         * @param [Object] object
         */
        constructor: function(branch, object)
        {
            this.objectType = "Gitana.NodeMap";

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

            this.base(branch.getServer(), object);
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().nodeMap(this.getBranch(), this.object);
        },

        /**
         * @param json
         */
        buildObject: function(json)
        {
            return this.getFactory().node(this.getBranch(), json);
        }

    });

})(window);
