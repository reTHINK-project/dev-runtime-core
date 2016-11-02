export const runtimeConfiguration = {
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
      prefix: 'hyperty-runtime://catalogue.',
      suffix: ''
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
