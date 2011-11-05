(function(window)
{
    var Gitana = window.Gitana;
    
    /**
     * Object factory
     *
     * Produces object instances (nodes included) for given json.
     */
    Gitana.ObjectFactory = Base.extend(
    /** @lends Gitana.ObjectFactory.prototype */
    {
        constructor: function()
        {
            this.create = function(klass, existing, object)
            {
                var created = new klass(existing, object);

                return created;
            }
        },

        server: function(driver)
        {
            return this.create(Gitana.Server, driver);
        },

        auditRecord: function(server, object)
        {
            return this.create(Gitana.AuditRecord, server, object);
        },

        repository: function(server, object)
        {
            return this.create(Gitana.Repository, server, object);
        },

        changeset: function(repository, object)
        {
            return this.create(Gitana.Changeset, repository, object);
        },

        branch: function(repository, object)
        {
            return this.create(Gitana.Branch, repository, object);
        },

        /**
         * Creates a node
         *
         * @param branch
         * @param object either object or the string type id
         */
        node: function(branch, object)
        {
            var objectClass = null;

            if (object)
            {
                // allow for object to be the type id
                if (Gitana.isString(object))
                {
                    object = {
                        "_type": object
                    };
                }

                // see if we can derive a more accurate type
                var type = object["_type"];
                if (type)
                {
                    if (Gitana.ObjectFactory.registry[type])
                    {
                        objectClass = Gitana.ObjectFactory.registry[type];
                    }
                }
                if (!objectClass)
                {
                    // allow default trip through to association for association types
                    if (type && Gitana.startsWith(type, "a:"))
                    {
                        objectClass = Gitana.Association;
                    }
                }
                if (!objectClass)
                {
                    // check out if it says its an association via special key
                    if (object["_is_association"])
                    {
                        objectClass = Gitana.Association;
                    }
                }
            }
            if (!objectClass)
            {
                // assume node
                objectClass = Gitana.Node;
            }

            // instantiate and set any properties
            return this.create(objectClass, branch, object);
        },

        association: function(branch, object)
        {
            return this.create(Gitana.Association, branch, object);
        },

        securityUser: function(server, object)
        {
            return this.create(Gitana.SecurityUser, server, object);
        },

        securityGroup: function(server, object)
        {
            return this.create(Gitana.SecurityGroup, server, object);
        },

        definition: function(branch, object)
        {
            return this.create(Gitana.Definition, branch, object);
        },

        form: function(branch, object)
        {
            return this.create(Gitana.Form, branch, object);
        },

        job: function(server, object)
        {
            return this.create(Gitana.Job, server, object);
        },

        logEntry: function(server, object)
        {
            return this.create(Gitana.LogEntry, server, object);
        },

        organization: function(server, object)
        {
            return this.create(Gitana.Organization, server, object);
        },

        team: function(server, teamable, teamKey, object)
        {
            return new Gitana.Team(server, teamable, teamKey, object);
        },


        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // MAPS
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////

        auditRecordMap: function(server, object)
        {
            return this.create(Gitana.AuditRecordMap, server, object);
        },

        branchMap: function(repository, object)
        {
            return this.create(Gitana.BranchMap, repository, object);
        },

        changesetMap: function(repository, object)
        {
            return this.create(Gitana.ChangesetMap, repository, object);
        },

        nodeMap: function(branch, object)
        {
            return this.create(Gitana.NodeMap, branch, object);
        },

        principalMap: function(server, object)
        {
            return this.create(Gitana.PrincipalMap, server, object);
        },

        repositoryMap: function(server, object)
        {
            return this.create(Gitana.RepositoryMap, server, object);
        },

        jobMap: function(server, object)
        {
            return this.create(Gitana.JobMap, server, object);
        },

        logEntryMap: function(server, object)
        {
            return this.create(Gitana.LogEntryMap, server, object);
        },

        organizationMap: function(server, object)
        {
            return this.create(Gitana.OrganizationMap, server, object);
        },

        teamMap: function(server, teamable, object)
        {
            return new Gitana.TeamMap(server, teamable, object);
        },


        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // TRAVERSAL RESULTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////

        traversalResults: function(branch, object)
        {
            return this.create(Gitana.TraversalResults, branch, object);
        }

    });

    // static methods for registration
    Gitana.ObjectFactory.registry = { };
    Gitana.ObjectFactory.register = function(qname, objectClass)
    {
        Gitana.ObjectFactory.registry[qname] = objectClass;
    };

})(window);
