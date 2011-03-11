(function(window)
{
    var Gitana = window.Gitana;

    /**
     * Gitana Node
     */
    Gitana.Node = Gitana.AbstractNode.extend(
    {
        constructor: function(branch, object)
        {
            this.base(branch, object);
        },

        /**
         * Acquires the "child nodes" of this node.  This is done by fetching all of the nodes that are outgoing-associated to this
         * node with a association of type "a:child".
         *
         * @param callback (optional)
         */
        children: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);

            // OPTIONAL
            var callback = args.shift();

            // invoke
            this.getDriver().gitanaGet("/repositories/" + this.getRepository().getId() + "/branches/" + this.getBranch().getId() + "/nodes/" + this.getId() + "/children", function(response) {

                response.list = _this.buildList(response.rows);

                // fire the callback
                if (callback)
                {
                    callback(response);
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * Retrieves all of the incoming association objects for this node.
         *
         * @param type (optional)
         * @param callback (optional)
         */
        incomingAssociations: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // OPTIONAL
            var type = null;
            var callback = null;
            if (args.length == 1) {
                if (this.isFunction(args[0])) {
                    callback = args.shift();
                }
                else {
                    type = args.shift();
                }
            }
            else if (args.length == 2) {
                type = args.shift();
                callback = args.shift();
            }

            // invoke
            var url = "/repositories/" + this.getRepository().getId() + "/branches/" + this.getBranch().getId() + "/nodes/" + this.getId() + "/incoming";
            if (type)
            {
                url = url + "?type=" + type;
            }
            this.getDriver().gitanaGet(url, function(response) {

                response.list = _this.buildList(response.rows);

                // fire the callback
                if (callback)
                {
                    callback(response);
                }

            }, this.ajaxErrorHandler)
        },

        /**
         * Retrieves all of the outgoing association objects for this node.
         *
         * @param type (optional)
         * @param callback (optional)
         */
        outgoingAssociations: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // OPTIONAL
            var type = null;
            var callback = null;
            if (args.length == 1) {
                if (this.isFunction(args[0])) {
                    callback = args.shift();
                }
                else {
                    type = args.shift();
                }
            }
            else if (args.length == 2) {
                type = args.shift();
                callback = args.shift();
            }

            // invoke
            var url = "/repositories/" + this.getRepository().getId() + "/branches/" + this.getBranch().getId() + "/nodes/" + this.getId() + "/outgoing";
            if (type)
            {
                url = url + "?type=" + type;
            }
            this.getDriver().gitanaGet(url, function(response) {

                response.list = _this.buildList(response.rows);

                // fire the callback
                if (callback)
                {
                    callback(response);
                }

            }, this.ajaxErrorHandler)
        },

        /**
         * Associates a target node to this node.
         *
         * @param targetNodeId
         * @param type (optional) - if not supplied, assumes child type (on server side)
         * @param callback (optional)
         */
        associate: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // REQUIRED
            var targetNodeId = args.shift();

            // OPTIONAL
            var type = null;
            var callback = null;
            if (args.length == 1) {
                if (this.isFunction(args[0])) {
                    callback = args.shift();
                }
                else {
                    type = args.shift();
                }
            }
            else if (args.length == 2) {
                type = args.shift();
                callback = args.shift();
            }

            // invoke
            var url = "/repositories/" + this.getRepository().getId() + "/branches/" + this.getBranch().getId() + "/nodes/" + this.getId() + "/associate?node=" + targetNodeId;
            if (type)
            {
                url = url + "&type=" + type;
            }
            this.getDriver().gitanaPost(url, {}, function(response) {

                // fire the callback
                if (callback)
                {
                    callback(response);
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * Unassociates a target node from this node.
         *
         * @param targetNodeId
         * @param type (optional) - if not supplied, assumes child type (on server side)
         * @param callback (optional)
         */
        unassociate: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // REQUIRED
            var targetNodeId = args.shift();

            // OPTIONAL
            var type = null;
            var callback = null;
            if (args.length == 1) {
                if (this.isFunction(args[0])) {
                    callback = args.shift();
                }
                else {
                    type = args.shift();
                }
            }
            else if (args.length == 2) {
                type = args.shift();
                callback = args.shift();
            }

            // invoke
            var url = "/repositories/" + this.getRepository().getId() + "/branches/" + this.getBranch().getId() + "/nodes/" + this.getId() + "/unassociate?node=" + targetNodeId;
            if (type)
            {
                url = url + "&type=" + type;
            }
            this.getDriver().gitanaPost(url, {}, function(response) {

                // fire the callback
                if (callback)
                {
                    callback(response);
                }

            }, this.ajaxErrorHandler);
        },

        /**
         * Traverses around the node and returns any nodes found to be connected on the graph.
         *
         * Example config:
         *
         * "traverse": {
         *    "associations": {
         *       "a:child": "BOTH",
         *       "a:knows": "INCOMING",
         *       "a:related": "OUTGOING"
         *    },
         *    "depth": 1,
         *    "types": [ "custom:type1", "custom:type2" ]
         * } 
         *
         * @param config
         * @param callback (optional)
         */
        traverse: function()
        {
            var _this = this;

            var args = this.makeArray(arguments);
            if (args.length == 0) {
                // TODO: error
            }

            // REQUIRED
            var config = args.shift();

            // OPTIONAL
            var callback = args.shift();

            // build the payload
            var payload = {
                "traverse": config
            };

            // invoke
            var url = "/repositories/" + this.getRepository().getId() + "/branches/" + this.getBranch().getId() + "/nodes/" + this.getId() + "/traverse";
            this.getDriver().gitanaPost(url, payload, function(response)
            {
                // convert the nodes to a node list as well as a node map
                response.nodeList = _this.buildList(response.nodes);
                response.nodeMap = _this.buildMap(response.nodes);
                response.associationList = _this.buildList(response.associations);
                response.associationMap = _this.buildMap(response.assocations);
                
                // fire the callback
                if (callback)
                {
                    callback(response);
                }

            }, this.ajaxErrorHandler);
        }

    });

})(window);
