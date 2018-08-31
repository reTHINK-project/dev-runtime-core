import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

import { descriptors } from './resources/descriptors.js';

import { buildURL } from '../src/utils/utils';
import { runtimeConfiguration } from './resources/runtimeConfiguration';
import { runtimeFactory } from './resources/runtimeFactory';
import Descriptors from '../src/runtime/Descriptors';
import RuntimeCatalogue from '../src/runtime-catalogue/RuntimeCatalogue';

describe('Should get configuration and parse to Descriptors', () => {

  // Testing Registry
  let domain = 'sp.domain';
  let runtimeURL = 'hyperty-runtime://' + domain + '/123';
  let descriptorsInstance;

  runtimeConfiguration.domain = domain;

  before(()=> {
    let catalogue = new RuntimeCatalogue(runtimeFactory);
    descriptorsInstance = new Descriptors(runtimeURL, catalogue, runtimeConfiguration);

    
    sinon.stub(descriptorsInstance.catalogue, 'getStubDescriptor').callsFake((url) => {
      return new Promise((resolve) => {
        resolve(descriptors.ProtoStubs.default);
      });
    });

    sinon.stub(descriptorsInstance.catalogue, 'getIdpProxyDescriptor').callsFake((url) => {
      return new Promise((resolve, reject) => {
        if (url.includes('catalogue.google.com')) {
          reject();
        } else {
          resolve(descriptors.IdpProxies['google.com']);
        }
      });
    });

    sinon.stub(descriptorsInstance.catalogue, 'getHypertyDescriptor').callsFake((url) => {
      return new Promise((resolve) => {
        resolve(descriptors.Hyperties.HelloHyperty);
      });
    });

  });

  after(() => {
    descriptorsInstance.catalogue.getIdpProxyDescriptor.restore();
    descriptorsInstance.catalogue.getHypertyDescriptor.restore();
    descriptorsInstance.catalogue.getStubDescriptor.restore();
  });

  it('constructor should receive 3 arguments', () => {

    expect(descriptorsInstance)
    .to.have.property('runtimeURL')
    .that.is.an('string')
    .to.not.be.empty;

    expect(descriptorsInstance)
    .to.have.property('catalogue');

    expect(descriptorsInstance)
    .to.have.property('runtimeConfiguration')
    .that.is.a('object')
    .and.to.contain.all.keys(runtimeConfiguration);

  });

  it('should get hyperty', (done) => {

    let hypertyDescriptorURL = 'hyperty-catalogue://catalogue.sp.domain/.well-known/hyperty/Connector';

    expect(descriptorsInstance.getHypertyDescriptor(hypertyDescriptorURL))
    .to.be.fulfilled
    .and.notify(done);

  });

  it('should get protocolstub', (done) => {

    let stubDescriptorURL = 'sp.domain';

    expect(descriptorsInstance.getStubDescriptor(stubDescriptorURL))
    .to.be.fulfilled
    .and.notify(done);

  });

  it('should get protocolstub', (done) => {

    let idpProxyURL = 'google.com';

    expect(descriptorsInstance.getIdpProxyDescriptor(idpProxyURL))
    .to.be.fulfilled
    .and.notify(done);

  });

});
