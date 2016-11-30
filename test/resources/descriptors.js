export const descriptors = {

  Hyperties: {
    HelloHyperty: {
      sourcePackage: {
        sourceCode: '',
        sourceCodeClassname: 'HelloHyperty',
        encoding: 'UTF-8',
        signature: ''
      },
      cguid: 10003,
      version: 0.1,
      description: 'Description of GroupChat',
      objectName: 'HelloHyperty',
      configuration: {},
      hypertyType: [
        'chat'
      ],
      sourcePackageURL: '/sourcePackage',
      language: 'javascript',
      signature: '',
      messageSchemas: '',
      dataObjects: [
        'https://catalogue.sp.domain/.well-known/dataschema/Communication'
      ],
      accessControlPolicy: 'somePolicy'
    }
  },

  ProtoStubs: {
    default: {
      cguid: '1',
      type: '0',
      version: '0.1',
      description: 'description of VertxProtoStub',
      objectName: 'VertxProtoStub',
      sourcePackageURL: '/sourcePackage',
      sourcePackage: {
        sourceCode: '',
        sourceCodeClassname: 'VertxProtoStub',
        encoding: 'Base64',
        signature: ''
      },
      language: 'Javascript ECMA5',
      signature: '',
      messageSchemas: '',
      configuration: {
        url: 'wss://127.0.0.1:9090/ws'
      },
      constraints: '',
      hypertyCapabilities: '',
      protocolCapabilities: '',
      policies: '',
      dataObjects: []
    },
    'slack.com': {
      sourcePackage: {
        sourceCode: '',
        sourceCodeClassname: 'SlackProtoStub',
        encoding: 'base64',
        signature: ''
      },
      sourcePackageURL: '/sourcePackage',
      cguid: '4-6e7a55d5-3daf-cdc4-63fb-8b2984ada3651',
      version: '0.5',
      description: 'Description of SlackProtoStub',
      language: 'Javascript',
      type: 'ProtoStubs',
      objectName: 'SlackProtoStub',
      configuration: {},
      messageSchemas: '',
      signature: '',
      accessControlPolicy: 'somePolicy',
      constraints: '',
      dataObjects: [],
      interworking: true
    }
  },

  IdpProxies: {
    default: {
      cguid: '1',
      type: '0',
      version: '0.1',
      description: 'description of VertxProtoStub',
      objectName: 'VertxProtoStub',
      sourcePackageURL: '/sourcePackage',
      sourcePackage: {
        sourceCode: '',
        sourceCodeClassname: 'VertxProtoStub',
        encoding: 'Base64',
        signature: ''
      },
      language: 'Javascript ECMA5',
      signature: '',
      messageSchemas: '',
      configuration: {
        url: 'wss://127.0.0.1:9090/ws'
      },
      constraints: '',
      hypertyCapabilities: '',
      protocolCapabilities: '',
      policies: '',
      dataObjects: []
    }
  }

};
