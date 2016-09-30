import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

import { buildURL } from '../src/utils/utils';
import { runtimeConfiguration } from './resources/runtimeConfiguration';
import { runtimeFactory } from './resources/runtimeFactory';
import Descriptors from '../src/runtime/Descriptors';

describe('Should get configuration and parse to Descriptors', () => {

  // Testing Registry
  let domain = 'sp.domain';
  let runtimeURL = 'hyperty-runtime://' + domain + '/123';
  let descriptors;
  let Hyperties;
  let ProtoStubs;
  let IdpProxies;

  runtimeConfiguration.domain = domain;

  before(()=> {
    let catalogue = runtimeFactory.createRuntimeCatalogue();
    descriptors = new Descriptors(runtimeURL, catalogue, runtimeConfiguration);

    Hyperties = {
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
    };

    ProtoStubs = {
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
    };

    IdpProxies = {
      'google.com': {
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
    };

    sinon.stub(descriptors.catalogue, 'getStubDescriptor', (url) => {
      return new Promise((resolve) => {
        resolve(ProtoStubs.default);
      });
    });

    sinon.stub(descriptors.catalogue, 'getIdpProxyDescriptor', (url) => {
      return new Promise((resolve, reject) => {
        if (url.includes('catalogue.google.com')) {
          reject();
        } else {
          resolve(IdpProxies['google.com']);
        }
      });
    });

    sinon.stub(descriptors.catalogue, 'getHypertyDescriptor', (url) => {
      return new Promise((resolve) => {
        resolve(Hyperties.HelloHyperty);
      });
    });

  });

  after(() => {
    descriptors.catalogue.getIdpProxyDescriptor.restore();
    descriptors.catalogue.getHypertyDescriptor.restore();
    descriptors.catalogue.getStubDescriptor.restore();
  });

  it('constructor should receive 3 arguments', () => {

    expect(descriptors)
    .to.have.property('runtimeURL')
    .that.is.an('string')
    .to.not.be.empty;

    expect(descriptors)
    .to.have.property('catalogue');

    expect(descriptors)
    .to.have.property('runtimeConfiguration')
    .that.is.a('object')
    .and.to.contain.all.keys(runtimeConfiguration);

  });

  it('should get hyperty', (done) => {

    let hypertyDescriptorURL = 'hyperty-catalogue://catalogue.sp.domain/.well-known/hyperty/Connector';

    expect(descriptors.getHypertyDescriptor(hypertyDescriptorURL))
    .to.be.fulfilled
    .and.notify(done);

  });

  it('should get protocolstub', (done) => {

    let stubDescriptorURL = 'sp.domain';

    expect(descriptors.getStubDescriptor(stubDescriptorURL))
    .to.be.fulfilled
    .and.notify(done);

  });

  it('should get protocolstub', (done) => {

    let idpProxyURL = 'google.com';

    expect(descriptors.getIdpProxyDescriptor(idpProxyURL))
    .to.be.fulfilled
    .and.notify(done);

  });

});
