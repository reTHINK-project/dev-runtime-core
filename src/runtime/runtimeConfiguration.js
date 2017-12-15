export const runtimeConfiguration = {

  // TODO this should be changed with the definition used for indexeddb
  // look at: https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore
  // Now we are using the definition for Dexie; (http://dexie.org/docs/Version/Version.stores())
  storageSchemas: {
    runtime: 'key,version,value',
    'registry:HypertyURLs': 'key,version,value',
    'registry:DataObjectURLs': 'key,version,value',
    p2pHandler: 'key,version,value',
    catalogue: '&cguid, accessControlPolicy, constraints, dataObjects, hypertyType, objectName, sourcePackage, version',
    identityModule: '&userURL,idp',
    hypertyResources: '&resourceURL, name, contentUrl, content, created, reporter, resourceType',
    syncerManager: 'key,version,value'
  },

  runtimeURLS: {
    registry: {
      prefix: 'hyperty-runtime://',
      suffix: 'registry'
    },
    identityModule: {
      prefix: 'hyperty-runtime://',
      suffix: '/idm'
    },
    runtimeUA: {
      prefix: 'hyperty-runtime://',
      suffix: '/ua'
    },
    catalogue: {
      prefix: 'hyperty-runtime://',
      suffix: '/catalogue'
    },
    graphConnector: {
      prefix: 'hyperty-runtime://',
      suffix: '/graph'
    },
    syncManager: {
      prefix: 'hyperty-runtime://',
      suffix: '/sm'
    }
  },
  catalogueURLs: {
    protocolstub: {
      prefix: 'hyperty-catalogue://catalogue.',
      suffix: '/.well-known/protocolstub/',
      fallback: 'hyperty-catalogue://catalogue.%domain%/.well-known/protocolstub/'
    },
    idpProxy: {
      prefix: 'hyperty-catalogue://catalogue.',
      suffix: '/.well-known/idp-proxy/',
      fallback: 'hyperty-catalogue://catalogue.%domain%/.well-known/idp-proxy/'
    }
  },
  msgNodeURL: {
    prefix: 'domain://msg-node.',
    suffix: '',
    hypertyAddressAllocation: '/hyperty-address-allocation',
    objectAddressAllocation: '/object-address-allocation',
    subscriptionManagement: '/sm'
  },
  domainRegistryURL: {
    prefix: 'domain://registry.',
    suffix: ''
  },
  globalRegistryURL: 'global://registry.'
};
