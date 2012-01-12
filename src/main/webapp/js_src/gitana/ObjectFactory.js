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

        platformDataStoreMap: function(platform, object)
        {
            return this.create(Gitana.PlatformDataStoreMap, platform, object);
        },

        platformDataStore: function(platform, object)
        {
            var type = object.datastoreType;

            return this[type](platform, object);
        },



        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // CLUSTER
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        platform: function(cluster, object)
        {
            return this.create(Gitana.Platform, cluster, object);
        },

        job: function(cluster, object)
        {
            return this.create(Gitana.Job, cluster, object);
        },

        jobMap: function(cluster, object)
        {
            return this.create(Gitana.JobMap, cluster, object);
        },

        logEntry: function(cluster, object)
        {
            return this.create(Gitana.LogEntry, cluster, object);
        },

        logEntryMap: function(cluster, object)
        {
            return this.create(Gitana.LogEntryMap, cluster, object);
        },



        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // PLATFORM
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        auditRecord: function(repository, object)
        {
            return this.create(Gitana.AuditRecord, repository, object);
        },

        auditRecordMap: function(repository, object)
        {
            return this.create(Gitana.AuditRecordMap, repository, object);
        },

        stack: function(platform, object)
        {
            return this.create(Gitana.Stack, platform, object);
        },

        stackMap: function(platform, object)
        {
            return this.create(Gitana.StackMap, platform, object);
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

        registrar: function(platform, object)
        {
            return this.create(Gitana.Registrar, platform, object);
        },

        registrarMap: function(platform, object)
        {
            return this.create(Gitana.RegistrarMap, platform, object);
        },

        application: function(platform, object)
        {
            return this.create(Gitana.Application, platform, object);
        },

        applicationMap: function(platform, object)
        {
            return this.create(Gitana.ApplicationMap, platform, object);
        },

        consumer: function(platform, object)
        {
            return this.create(Gitana.Consumer, platform, object);
        },

        consumerMap: function(platform, object)
        {
            return this.create(Gitana.ConsumerMap, platform, object);
        },

        authenticationGrant: function(platform, object)
        {
            return this.create(Gitana.AuthenticationGrant, platform, object);
        },

        authenticationGrantMap: function(platform, object)
        {
            return this.create(Gitana.AuthenticationGrantMap, platform, object);
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

            // extend the principal pre-emptively if we have an object
            if (object)
            {
                this.extendPrincipal(principal);
            }

            return principal;
        },

        domainPrincipalMap: function(cluster, object)
        {
            return this.create(Gitana.PrincipalMap, cluster, object);
        },

        extendPrincipal: function(principal)
        {
            if (!principal.TYPE && principal.objectType == "Gitana.DomainPrincipal")
            {
                if (principal.getType() == "USER")
                {
                    Gitana.stampInto(principal, Gitana.DomainUser);
                }
                else if (principal.getType() == "GROUP")
                {
                    Gitana.stampInto(principal, Gitana.DomainGroup);
                }
            }
        },



        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // VAULTS
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        archive: function(vault, object)
        {
            return this.create(Gitana.Archive, vault, object);
        },

        archiveMap: function(vault, object)
        {
            return this.create(Gitana.ArchiveMap, vault, object);
        },



        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // MISCELLANEOUS
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        team: function(cluster, teamable, teamKey, object)
        {
            return new Gitana.Team(cluster, teamable, teamKey, object);
        },

        teamMap: function(cluster, teamable, object)
        {
            return new Gitana.TeamMap(cluster, teamable, object);
        },




        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // REGISTRAR
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        tenant: function(registrar, object)
        {
            return this.create(Gitana.Tenant, registrar, object);
        },

        tenantMap: function(registrar, object)
        {
            return this.create(Gitana.TenantMap, registrar, object);
        },

        plan: function(registrar, object)
        {
            return this.create(Gitana.Plan, registrar, object);
        },

        planMap: function(registrar, object)
        {
            return this.create(Gitana.PlanMap, registrar, object);
        }

    });

    // static methods for registration
    Gitana.ObjectFactory.registry = { };
    Gitana.ObjectFactory.register = function(qname, objectClass)
    {
        Gitana.ObjectFactory.registry[qname] = objectClass;
    };

})(window);
