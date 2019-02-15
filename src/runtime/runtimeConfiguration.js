export const runtimeConfiguration = {

  // TODO this should be changed with the definition used for indexeddb
  // look at: https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore
  // Now we are using the definition for Dexie; (http://dexie.org/docs/Version/Version.stores())
  storageSchemas: {
    capabilities: {
      capabilities: 'key,version,value'
    },
    subscriptions: {
      subscriptions: 'key,version,value'
    },
    runtime: {
      'runtime:URL': 'key,version,value',
      'p2pHandler:URL': 'key,version,value'
    },
    registry: {
      'registry:DataObjectURLs': 'key,version,value',
      'registry:HypertyURLs': 'key,version,value'
    },
    cryptoManager: {
      userAsymmetricKey: 'key,version,value',
      dataObjectSessionKeys: 'key,version,value'
    },
    identity: {
      accessTokens: 'key,version,value',
      identities: 'userURL, userProfile.email, userProfile.userURL, userProfile.name'
    },
    runtimeCatalogue: {
      runtimeCatalogue: '&cguid, accessControlPolicy, constraints, dataObjects, type, objectName, sourcePackage, version, url'
    },
    policy: {
      'rethink:activePolicy': 'key,version,value',
      'rethink:groups': 'key,version,value',
      'rethink:userPolicies': 'key,version,value',
      'rethink:spPolicies': 'key,version,value'
    },
    syncherManager: {
      'syncherManager:ObjectURLs': 'key,version,value',
      'remotes': 'key,version,value'
    },
    hypertyResources: {
      hypertyResources: '&resourceURL, name, contentUrl, content, created, reporter, resourceType'
    }
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
  globalRegistryURL: 'global://registry.',
  remoteStorage: 'https://hysmart.rethink.ptinovacao.pt/backup/'
};
