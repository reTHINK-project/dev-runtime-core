export const descriptors = {

  Runtimes: {
    Runtime: {
      sourcePackage: {
        sourceCode: '',
        sourceCodeClassname: 'Runtime',
        encoding: 'base64',
        signature: ''
      },
      cguid: '3-43c6b47b-bdf8-4c42-96ae-e4f2b7dfcdac0',
      type: 'Runtimes',
      version: 15.89999999999996,
      description: 'Description of Runtime',
      objectName: 'Runtime',
      configuration: {},
      runtimeType: 'browser',
      hypertyCapabilities: {
        mic: true,
        camera: true,
        sensor: false,
        webrtc: true,
        ortc: true
      },
      protocolCapabilities: {
        http: true,
        https: true,
        ws: true,
        wss: true,
        coap: false,
        datachannel: false
      },
      sourcePackageURL: '/sourcePackage',
      language: 'javascript',
      signature: '',
      messageSchemas: '',
      dataObjects: [],
      accessControlPolicy: 'somePolicy',
      p2pHandlerStub: 'https://catalogue.sp.domain/.well-known/protocolstub/P2PHandlerStub',
      p2pRequesterStub: ''
    }
  },

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
    P2PHandlerStub: {
      sourcePackage: {
        sourceCode: '',
        sourceCodeClassname: 'P2PRequesterStub',
        encoding: 'base64',
        signature: ''
      },
      sourcePackageURL: '/sourcePackage',
      cguid: '4-d1c8fa16-ffd5-8164-f4e2-7ceb1506446e4',
      version: 0.2,
      description: 'Description of P2PRequesterStub',
      language: 'Javascript',
      type: 'ProtoStubs',
      objectName: 'P2PRequesterStub',
      configuration: {},
      messageSchemas: '',
      signature: '',
      accessControlPolicy: 'somePolicy',
      constraints: '',
      dataObjects: []
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
