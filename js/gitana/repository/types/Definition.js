(function(window)
{
    const Gitana = window.Gitana;

    Gitana.Definition = Gitana.Node.extend(
    /** @lends Gitana.Definition.prototype */
    {
        /**
         * @constructs
         * @augments Gitana.Node
         *
         * @class Definition
         *
         * @param {Gitana.Branch} branch
         * @param {Object} object json object (if no callback required for populating)
         */
        constructor: function(branch, object)
        {
            this.base(branch, object);

            this.objectType = function() { return "Gitana.Definition"; };
        },

        /**
         * @override
         */
        clone: function()
        {
            return this.getFactory().definition(this.getBranch(), this);
        },

        /**
         * Acquires a list of associations of type "a:has_form" for this definition.
         *
         * @chaining node map
         *
         * @public
         */
        listFormAssociations: function()
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/forms";
            };

            const chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Reads a form by form key that is associated to this definition.
         *
         * @public
         *
         * @param {String} formKey the form key
         */
        readForm: function(formKey)
        {
            const self = this;

            const uriFunction = function()
            {
                return self.getUri() + "/forms/" + formKey;
            };

            const chainable = this.getFactory().form(this.getBranch());
            return this.chainGet(chainable, uriFunction);
        },

        /**
         * Creates a form and associates it to this definition.
         *
         * @public
         *
         * @param {String} formKey the form key
         * @param {Object} formObject the object that constitutes the form
         * @param {String} formPath optional formPath to pass to create node
         */
        createForm: function(formKey, formObject, formPath)
        {
            const self = this;

            if (typeof(formObject) === "string")
            {
                formPath = formObject;
                formObject = null;
            }

            // set up form object
            if (!formObject)
            {
                formObject = {};
            }
            formObject["_type"] = "n:form";

            const chainable = this.getFactory().form(this.getBranch());

            // subchain that want to hand back
            const result = this.subchain(chainable);

            // now push our logic into a subchain that is the first thing in the result
            result.subchain(this.getBranch()).createNode(formObject, formPath).then(function() {
                const formNode = this;

                // switch to definition node
                this.subchain(self).then(function() {
                    const associationObject = {
                        "_type": "a:has_form",
                        "form-key": formKey
                    };
                    this.associate(formNode, associationObject).then(function() {

                        const association = this;

                        // read back into the form chainable
                        const uri = "/repositories/" + formNode.getRepositoryId() + "/branches/" + formNode.getBranchId() + "/nodes/" + formNode.getId();
                        this.getDriver().gitanaGet(uri, null, {}, function(response) {

                            result.handleResponse(response);
                            association.next();
                        });

                        // we manually signal when this then() is done
                        return false;
                    });
                });
            });

            return result;
        },

        /**
         * Convenience function to remove a form linked to this definition.
         * Note: This doesn't delete the form, it simply unlinks the association.
         *
         * @chained this
         *
         * @public
         *
         * @param {String} formKey the form key
         */
        removeFormAssociation: function(formKey)
        {
            return this.subchain(this).then(function() {

                let association = null;

                this.listFormAssociations().each(function() {
                    if (this.getFormKey() === formKey)
                    {
                        association = this;
                    }
                }).then(function() {

                    if (association)
                    {
                        this.subchain(association).del();
                    }
                });
            });
        },

        /**
         * Acquires a list of child definitions.
         *
         * @param {object} pagination
         *
         * @chaining node map
         *
         * @public
         */
        listChildDefinitions: function(pagination)
        {
            const self = this;

            const params = {};
            if (pagination)
            {
                Gitana.copyInto(params, pagination);
            }

            const uriFunction = function()
            {
                return self.getBranch().getUri() + "/definitions/" + this.getQName() + "/children";
            };

            const chainable = this.getFactory().nodeMap(this.getBranch());
            return this.chainGet(chainable, uriFunction, params);
        }

    });

    Gitana.ObjectFactory.register("d:type", Gitana.Definition);
    Gitana.ObjectFactory.register("d:feature", Gitana.Definition);
    Gitana.ObjectFactory.register("d:association", Gitana.Definition);

})(window);
