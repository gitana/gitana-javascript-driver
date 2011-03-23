(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Node Factory
     *
     * Produces node implementation classes for given Gitana node json.
     */
    Gitana.NodeFactory = Gitana.Abstract.extend(
    {
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

        list: function(branch, array)
        {
            var list = [];
            for each (element in array)
            {
                list[list.length] = this.produce(branch, element);
            }
            return list;
        },

        map: function(branch, array)
        {
            var map = {};
            for each (element in array)
            {
                var b = this.produce(branch, element);
                map[b.getId()] = b;
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
