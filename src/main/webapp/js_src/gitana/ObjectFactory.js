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

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // PLATFORM
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        platform: function(driver, object)
        {
            return this.create(Gitana.Platform, driver, object);
        },

        auditRecord: function(repository, object)
        {
            return this.create(Gitana.AuditRecord, repository, object);
        },

        auditRecordMap: function(repository, object)
        {
            return this.create(Gitana.AuditRecordMap, repository, object);
        },

        job: function(platform, object)
        {
            return this.create(Gitana.Job, platform, object);
        },

        jobMap: function(platform, object)
        {
            return this.create(Gitana.JobMap, platform, object);
        },

        logEntry: function(platform, object)
        {
            return this.create(Gitana.LogEntry, platform, object);
        },

        logEntryMap: function(platform, object)
        {
            return this.create(Gitana.LogEntryMap, platform, object);
        },

        organization: function(platform, object)
        {
            return this.create(Gitana.Organization, platform, object);
        },

        organizationMap: function(platform, object)
        {
            return this.create(Gitana.OrganizationMap, platform, object);
        },

        repository: function(platform, object)
        {
            return this.create(Gitana.Repository, platform, object);
        },

        repositoryMap: function(platform, object)
        {
            return this.create(Gitana.RepositoryMap, platform, object);
        },

        domain: function(platform, object)
        {
            return this.create(Gitana.Domain, platform, object);
        },

        domainMap: function(platform, object)
        {
            return this.create(Gitana.DomainMap, platform, object);
        },

        vault: function(platform, object)
        {
            return this.create(Gitana.Vault, platform, object);
        },

        vaultMap: function(platform, object)
        {
            return this.create(Gitana.VaultMap, platform, object);
        },



        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // REPOSITORY
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

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

        definition: function(branch, object)
        {
            return this.create(Gitana.Definition, branch, object);
        },

        form: function(branch, object)
        {
            return this.create(Gitana.Form, branch, object);
        },

        traversalResults: function(branch, object)
        {
            return this.create(Gitana.TraversalResults, branch, object);
        },



        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // DOMAINS
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        domainPrincipal: function(domain, object)
        {
            var principal = null;

            // create the principal
            principal = this.create(Gitana.DomainPrincipal, domain, object);

            if (object && !principal.TYPE)
            {
                // if we know the principal type, we can extend the object now
                if (object["type"] == "USER")
                {
                    principal = principal.extend(Gitana.DomainUser);
                }
                if (object["type"] == "GROUP")
                {
                    principal = principal.extend(Gitana.DomainGroup);
                }
            }

            return principal;
        },

        domainPrincipalMap: function(platform, object)
        {
            return this.create(Gitana.PrincipalMap, platform, object);
        },



        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // VAULTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        archive: function(vault, object)
        {
            return this.create(Gitana.Archive, domain, object);
        },



        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // MISCELLANEOUS
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        team: function(server, teamable, teamKey, object)
        {
            return new Gitana.Team(server, teamable, teamKey, object);
        },

        teamMap: function(server, teamable, object)
        {
            return new Gitana.TeamMap(server, teamable, object);
        },




        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // MANAGEMENT
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        management: function(platform, object)
        {
            return this.create(Gitana.Management, platform, object);
        },

        tenant: function(management, object)
        {
            return this.create(Gitana.Tenant, management, object);
        },

        tenantMap: function(management, object)
        {
            return this.create(Gitana.TenantMap, management, object);
        },

        plan: function(management, object)
        {
            return this.create(Gitana.Plan, management, object);
        },

        planMap: function(management, object)
        {
            return this.create(Gitana.PlanMap, management, object);
        },

        allocation: function(management, object)
        {
            return this.create(Gitana.Allocation, management, object);
        },

        allocationMap: function(management, object)
        {
            return this.create(Gitana.AllocationMap, management, object);
        }

    });

    // static methods for registration
    Gitana.ObjectFactory.registry = { };
    Gitana.ObjectFactory.register = function(qname, objectClass)
    {
        Gitana.ObjectFactory.registry[qname] = objectClass;
    };

})(window);
