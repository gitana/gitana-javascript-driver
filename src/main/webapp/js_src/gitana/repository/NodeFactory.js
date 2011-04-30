(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Node Factory
     *
     * Produces node implementation classes for given Gitana node json.
     */
    Gitana.NodeFactory = Gitana.Abstract.extend(
    /** @lends Gitana.NodeFactory.prototype */
    {
        /**
         * Builds a node for the given branch and object.
         *
         * This walks through the registry to find an object class for the type of object being passed in.
         * The object type is determined from the "_type" field.
         *
         * @param {Gitana.Branch} branch the branch on which the node resides
         * @param {Object} the node json object
         */
        produce: function(branch, object)
        {
            var objectClass = null;

            // see if we can derive a more accurate type
            var type = object["_type"];
            if (!type)
            {
                alert("No _type field on node - cannot proceed");
            }
            else
            {
                if (Gitana.NodeFactory.registry[type])
                {
                    objectClass = Gitana.NodeFactory.registry[type];
                }
                if (!objectClass)
                {
                    // allow default trip through to association for association types
                    if (this.startsWith(type, "a:"))
                    {
                        objectClass = Gitana.Association;
                    }
                }
                if (!objectClass)
                {
                    // assume node
                    objectClass = Gitana.Node;
                }
            }

            // instantiate and set any properties
            var instance = new objectClass(branch, object);

            // TODO: set any properties?

            return instance;
        },

        /**
         * Builds a list of nodes for the given array of objects.
         *
         * @param {Gitana.Branch} branch The branch on which the nodes reside.
         * @param {Array} array The array of json objects.
         *
         * @returns {Array} an array of Gitana.Node objects keyed by node id
         */
        list: function(branch, array)
        {
            var list = [];

            if (array)
            {
                for (var i = 0; i < array.length; i++)
                {
                    list.push(this.produce(branch, array[i]));
                }
            }

            return list;
        },

        /**
         * Builds a map of nodes for the given array of objects.
         * The map is keyed by node id.
         *
         * @param {Gitana.Branch} branch The branch on which the nodes reside.
         * @param {Array} array The array of json objects
         *
         * @returns {Object} map of Gitana.Node objects keyed by node id
         */
        map: function(branch, array)
        {
            var map = {};

            if (array)
            {
                for (var i = 0; i < array.length; i++)
                {
                    var b = this.produce(branch, array[i]);
                    map[b.getId()] = b;
                }
            }
            return map;
        }

    });

    // static methods for registration
    Gitana.NodeFactory.registry = { };
    Gitana.NodeFactory.register = function(qname, objectClass)
    {
        Gitana.NodeFactory.registry[qname] = objectClass;
    };

})(window);
