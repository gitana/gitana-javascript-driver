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
            };
        },

        platformDataStoreMap: function(platform, object)
        {
            return this.create(Gitana.PlatformDataStoreMap, platform, object);
        },

        platformDataStore: function(platform, object)
        {
            var type = object.datastoreTypeId;

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
            var type = null;

            if (object)
            {
                if (Gitana.isString(object))
                {
                    type = object;
                }
                else
                {
                    type = object["type"];
                }
            }

            var job = null;
            if ("copy" == type)
            {
                job = this.create(Gitana.CopyJob, cluster, object);
            }
            else if ("export" == type)
            {
                job = this.create(Gitana.TransferExportJob, cluster, object);
            }
            else if ("import" == type)
            {
                job = this.create(Gitana.TransferImportJob, cluster, object);
            }
            else
            {
                job = this.create(Gitana.Job, cluster, object);
            }

            return job;
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

        project: function(platform, object)
        {
            return this.create(Gitana.Project, platform, object);
        },

        projectMap: function(platform, object)
        {
            return this.create(Gitana.ProjectMap, platform, object);
        },

        uiConfig: function(platform, object)
        {
            return this.create(Gitana.UIConfig, platform, object);
        },

        uiConfigMap: function(platform, object)
        {
            return this.create(Gitana.UIConfigMap, platform, object);
        },

        scheduledWork: function(platform, object)
        {
            return this.create(Gitana.ScheduledWork, platform, object);
        },

        scheduledWorkMap: function(platform, object)
        {
            return this.create(Gitana.ScheduledWorkMap, platform, object);
        },

        report: function(platform, object)
        {
            return this.create(Gitana.Report, platform, object);
        },

        reportMap: function(platform, object)
        {
            return this.create(Gitana.ReportMap, platform, object);
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

        directory: function(platform, object)
        {
            return this.create(Gitana.Directory, platform, object);
        },

        directoryMap: function(platform, object)
        {
            return this.create(Gitana.DirectoryMap, platform, object);
        },

        application: function(platform, object)
        {
            return this.create(Gitana.Application, platform, object);
        },

        applicationMap: function(platform, object)
        {
            return this.create(Gitana.ApplicationMap, platform, object);
        },

        warehouse: function(platform, object)
        {
            return this.create(Gitana.Warehouse, platform, object);
        },

        warehouseMap: function(platform, object)
        {
            return this.create(Gitana.WarehouseMap, platform, object);
        },

        webhost: function(platform, object)
        {
            return this.create(Gitana.WebHost, platform, object);
        },

        webhostMap: function(platform, object)
        {
            return this.create(Gitana.WebHostMap, platform, object);
        },

        autoClientMapping: function(webhost, object)
        {
            return this.create(Gitana.AutoClientMapping, webhost, object);
        },

        autoClientMappingMap: function(webhost, object)
        {
            return this.create(Gitana.AutoClientMappingMap, webhost, object);
        },

        trustedDomainMapping: function(webhost, object)
        {
            return this.create(Gitana.TrustedDomainMapping, webhost, object);
        },

        trustedDomainMappingMap: function(webhost, object)
        {
            return this.create(Gitana.TrustedDomainMappingMap, webhost, object);
        },

        deployedApplication: function(webhost, object)
        {
            return this.create(Gitana.DeployedApplication, webhost, object);
        },

        deployedApplicationMap: function(webhost, object)
        {
            return this.create(Gitana.DeployedApplicationMap, webhost, object);
        },

        descriptor: function(platform, object)
        {
            return this.create(Gitana.Descriptor, platform, object);
        },

        descriptorMap: function(platform, object)
        {
            return this.create(Gitana.DescriptorMap, platform, object);
        },

        client: function(platform, object)
        {
            var client = this.create(Gitana.Client, platform, object);
            Gitana.stampInto(client, Gitana.ClientMethods);

            return client;
        },

        clientMap: function(platform, object)
        {
            return this.create(Gitana.ClientMap, platform, object);
        },

        authenticationGrant: function(platform, object)
        {
            return this.create(Gitana.AuthenticationGrant, platform, object);
        },

        authenticationGrantMap: function(platform, object)
        {
            return this.create(Gitana.AuthenticationGrantMap, platform, object);
        },

        billingProviderConfiguration: function(platform, object)
        {
            return this.create(Gitana.BillingProviderConfiguration, platform, object);
        },

        billingProviderConfigurationMap: function(platform, object)
        {
            return this.create(Gitana.BillingProviderConfigurationMap, platform, object);
        },

        workflowModel: function(platform, object)
        {
            return this.create(Gitana.WorkflowModel, platform, object);
        },

        workflowModelMap: function(platform, object)
        {
            return this.create(Gitana.WorkflowModelMap, platform, object);
        },

        workflowInstance: function(platform, object)
        {
            return this.create(Gitana.WorkflowInstance, platform, object);
        },

        workflowInstanceMap: function(platform, object)
        {
            return this.create(Gitana.WorkflowInstanceMap, platform, object);
        },

        workflowTask: function(platform, object)
        {
            return this.create(Gitana.WorkflowTask, platform, object);
        },

        workflowTaskMap: function(platform, object)
        {
            return this.create(Gitana.WorkflowTaskMap, platform, object);
        },

        workflowComment: function(platform, object)
        {
            return this.create(Gitana.WorkflowComment, platform, object);
        },

        workflowCommentMap: function(platform, object)
        {
            return this.create(Gitana.WorkflowCommentMap, platform, object);
        },

        deploymentReceiver: function(platform, object)
        {
            return this.create(Gitana.DeploymentReceiver, platform, object);
        },

        deploymentReceiverMap: function(platform, object)
        {
            return this.create(Gitana.DeploymentReceiverMap, platform, object);
        },

        deploymentPackage: function(platform, object)
        {
            return this.create(Gitana.DeploymentPackage, platform, object);
        },

        deploymentPackageMap: function(platform, object)
        {
            return this.create(Gitana.DeploymentPackageMap, platform, object);
        },

        deploymentStrategy: function(platform, object)
        {
            return this.create(Gitana.DeploymentStrategy, platform, object);
        },

        deploymentStrategyMap: function(platform, object)
        {
            return this.create(Gitana.DeploymentStrategyMap, platform, object);
        },

        deploymentTarget: function(platform, object)
        {
            return this.create(Gitana.DeploymentTarget, platform, object);
        },

        deploymentTargetMap: function(platform, object)
        {
            return this.create(Gitana.DeploymentTargetMap, platform, object);
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
                    if (object.__is_association && object.__is_association())
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

        release: function(repository, object)
        {
            return this.create(Gitana.Release, repository, object);
        },

        mergeConflict: function(repository, object)
        {
            return this.create(Gitana.MergeConflict, repository, object);
        },

        deletion: function(branch, object)
        {
            return this.create(Gitana.Deletion, branch, object);
        },

        branchMap: function(repository, object)
        {
            return this.create(Gitana.BranchMap, repository, object);
        },

        changesetMap: function(repository, object)
        {
            return this.create(Gitana.ChangesetMap, repository, object);
        },

        releaseMap: function(repository, object)
        {
            return this.create(Gitana.ReleaseMap, repository, object);
        },

        mergeConflictMap: function(repository, object)
        {
            return this.create(Gitana.MergeConflictMap, repository, object);
        },

        nodeMap: function(branch, object)
        {
            return this.create(Gitana.NodeMap, branch, object);
        },

        deletionMap: function(branch, object)
        {
            return this.create(Gitana.DeletionMap, branch, object);
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
            // create the principal
            var principal = this.create(Gitana.DomainPrincipal, domain, object);

            // extend the principal pre-emptively if we have an object
            if (object)
            {
                this.extendPrincipal(principal);
            }

            return principal;
        },

        domainPrincipalMap: function(domain, object)
        {
            return this.create(Gitana.PrincipalMap, domain, object);
        },

        extendPrincipal: function(principal)
        {
            if (principal.getType() && principal.objectType() == "Gitana.DomainPrincipal")
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

        team: function(cluster, teamable, object)
        {
            return new Gitana.Team(cluster, teamable, object);
        },

        teamMap: function(cluster, teamable, object)
        {
            return new Gitana.TeamMap(cluster, teamable, object);
        },

        activity: function(datastore, object)
        {
            return new Gitana.Activity(datastore, object);
        },

        activityMap: function(datastore, object)
        {
            return new Gitana.ActivityMap(datastore, object);
        },

        role: function(cluster, roleContainer, object)
        {
            return new Gitana.Role(cluster, roleContainer, object);
        },

        roleMap: function(cluster, roleContainer, object)
        {
            return new Gitana.RoleMap(cluster, roleContainer, object);
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
        },

        meter: function(registrar, object)
        {
            return this.create(Gitana.Meter, registrar, object);
        },

        meterMap: function(registrar, object)
        {
            return this.create(Gitana.MeterMap, registrar, object);
        },

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // DIRECTORY
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        identity: function(directory, object)
        {
            return this.create(Gitana.Identity, directory, object);
        },

        identityMap: function(directory, object)
        {
            return this.create(Gitana.IdentityMap, directory, object);
        },

        connection: function(directory, object)
        {
            return this.create(Gitana.Connection, directory, object);
        },

        connectionMap: function(directory, object)
        {
            return this.create(Gitana.ConnectionMap, directory, object);
        },

        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // WAREHOUSE
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        interactionApplication: function(warehouse, object)
        {
            return this.create(Gitana.InteractionApplication, warehouse, object);
        },

        interactionApplicationMap: function(warehouse, object)
        {
            return this.create(Gitana.InteractionApplicationMap, warehouse, object);
        },

        interactionSession: function(warehouse, object)
        {
            return this.create(Gitana.InteractionSession, warehouse, object);
        },

        interactionSessionMap: function(warehouse, object)
        {
            return this.create(Gitana.InteractionSessionMap, warehouse, object);
        },

        interactionPage: function(warehouse, object)
        {
            return this.create(Gitana.InteractionPage, warehouse, object);
        },

        interactionPageMap: function(warehouse, object)
        {
            return this.create(Gitana.InteractionPageMap, warehouse, object);
        },

        interactionNode: function(warehouse, object)
        {
            return this.create(Gitana.InteractionNode, warehouse, object);
        },

        interactionNodeMap: function(warehouse, object)
        {
            return this.create(Gitana.InteractionNodeMap, warehouse, object);
        },

        interactionUser: function(warehouse, object)
        {
            return this.create(Gitana.InteractionUser, warehouse, object);
        },

        interactionUserMap: function(warehouse, object)
        {
            return this.create(Gitana.InteractionUserMap, warehouse, object);
        },

        interactionContinent: function(warehouse, object)
        {
            return this.create(Gitana.InteractionContinent, warehouse, object);
        },

        interactionContinentMap: function(warehouse, object)
        {
            return this.create(Gitana.InteractionContinentMap, warehouse, object);
        },

        interactionCountry: function(warehouse, object)
        {
            return this.create(Gitana.InteractionCountry, warehouse, object);
        },

        interactionCountryMap: function(warehouse, object)
        {
            return this.create(Gitana.InteractionCountryMap, warehouse, object);
        },

        interactionCity: function(warehouse, object)
        {
            return this.create(Gitana.InteractionCity, warehouse, object);
        },

        interactionCityMap: function(warehouse, object)
        {
            return this.create(Gitana.InteractionCityMap, warehouse, object);
        },

        interactionRegion: function(warehouse, object)
        {
            return this.create(Gitana.InteractionRegion, warehouse, object);
        },

        interactionRegionMap: function(warehouse, object)
        {
            return this.create(Gitana.InteractionRegionMap, warehouse, object);
        },

        interactionPostalCode: function(warehouse, object)
        {
            return this.create(Gitana.InteractionPostalCode, warehouse, object);
        },

        interactionPostalCodeMap: function(warehouse, object)
        {
            return this.create(Gitana.InteractionPostalCodeMap, warehouse, object);
        },

        interactionUserAgent: function(warehouse, object)
        {
            return this.create(Gitana.InteractionUserAgent, warehouse, object);
        },

        interactionUserAgentMap: function(warehouse, object)
        {
            return this.create(Gitana.InteractionUserAgentMap, warehouse, object);
        },

        interactionOperatingSystem: function(warehouse, object)
        {
            return this.create(Gitana.InteractionOperatingSystem, warehouse, object);
        },

        interactionOperatingSystemMap: function(warehouse, object)
        {
            return this.create(Gitana.InteractionOperatingSystemMap, warehouse, object);
        },

        interactionDevice: function(warehouse, object)
        {
            return this.create(Gitana.InteractionDevice, warehouse, object);
        },

        interactionDeviceMap: function(warehouse, object)
        {
            return this.create(Gitana.InteractionDeviceMap, warehouse, object);
        },

        interactionReport: function(warehouse, object)
        {
            return this.create(Gitana.InteractionReport, warehouse, object);
        },

        interactionReportMap: function(warehouse, object)
        {
            return this.create(Gitana.InteractionReportMap, warehouse, object);
        },

        interactionReportEntry: function(warehouse, object)
        {
            return this.create(Gitana.InteractionReportEntry, warehouse, object);
        },

        interactionReportEntryMap: function(warehouse, object)
        {
            return this.create(Gitana.InteractionReportEntryMap, warehouse, object);
        },

        interaction: function(warehouse, object)
        {
            return this.create(Gitana.Interaction, warehouse, object);
        },

        interactionMap: function(warehouse, object)
        {
            return this.create(Gitana.InteractionMap, warehouse, object);
        },

        conversionTrigger: function(warehouse, object)
        {
            return this.create(Gitana.ConversionTrigger, warehouse, object);
        },

        conversionTriggerMap: function(warehouse, object)
        {
            return this.create(Gitana.ConversionTriggerMap, warehouse, object);
        },


        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // APPLICATION
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////////

        settings: function(application, object)
        {
            return this.create(Gitana.Settings, application, object);
        },

        settingsMap: function(application, object)
        {
            return this.create(Gitana.SettingsMap, application, object);
        },

        registration: function(application, object)
        {
            return this.create(Gitana.Registration, application, object);
        },

        registrationMap: function(application, object)
        {
            return this.create(Gitana.RegistrationMap, application, object);
        },

        pageRendition: function(application, object)
        {
            return this.create(Gitana.PageRendition, application, object);
        },

        pageRenditionMap: function(application, object)
        {
            return this.create(Gitana.PageRenditionMap, application, object);
        },

        email: function(application, object)
        {
            return this.create(Gitana.Email, application, object);
        },

        emailMap: function(application, object)
        {
            return this.create(Gitana.EmailMap, application, object);
        },

        emailProvider: function(application, object)
        {
            return this.create(Gitana.EmailProvider, application, object);
        },

        emailProviderMap: function(application, object)
        {
            return this.create(Gitana.EmailProviderMap, application, object);
        },

        message: function(application, object)
        {
            return this.create(Gitana.Message, application, object);
        },

        messageMap: function(application, object)
        {
            return this.create(Gitana.MessageMap, application, object);
        }

    });

    // static methods for registration
    Gitana.ObjectFactory.registry = { };
    Gitana.ObjectFactory.register = function(qname, objectClass)
    {
        Gitana.ObjectFactory.registry[qname] = objectClass;
    };

})(window);
