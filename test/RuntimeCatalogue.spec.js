import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

import runtimeCatalogue from '../src/runtime/RuntimeCatalogue';

// Testing runtimeUA;
describe('Runtime Catalogue', function() {

  let _hypertyDescriptor;
  let _stubDescriptor;

  before(function() {

    // Mockup the source code request
    let mockup = {
      mock:function() {
        console.log('asdasdsadsa');
      }
    };

    let tes = sinon.stub(runtimeCatalogue, '_makeExternalRequest');
    tes.returns(new Promise(function(resolve, reject) {
      resolve(mockup);
    }));

  });

  after(function() {
    runtimeCatalogue._makeExternalRequest.restore();
  });

  it('should have a common ajax request', function(done) {

    expect(runtimeCatalogue._makeExternalRequest('path/to/source/code'))
    .to.be.fulfilled
    .and.notify(done);

  });

  it('should get hyperty descriptor', function(done) {

    //
    // guid, id, description, kind, catalogueURL,
    // sourceCode, dataObject, type, messageSchemal,
    // policies, constraints, configuration,
    // hypertyCapabilities, protocolCapabilities
    //
    let descriptorValidation = [
      'guid', 'id', 'classname', 'description', 'kind', 'catalogueURL',
      'sourceCode', 'dataObject', 'type', 'messageSchema',
      'configuration', 'policies', 'constraints', 'hypertyCapabilities',
      'protocolCapabilities'
    ];

    // TODO: Check the hyperty descriptor response and compare
    // with what is defined in the specification;
    let hypertyDescriptorURL = 'hyperty-catalogue://sp1/HelloHyperty';
    expect(runtimeCatalogue.getHypertyDescriptor(hypertyDescriptorURL).then(function(hypertyDescriptor) {
      _hypertyDescriptor = hypertyDescriptor;
      return _hypertyDescriptor;
    }))
    .to.be.fulfilled
    .and.eventually.to.have.all.keys(descriptorValidation)
    .and.notify(done);

  });

  it('should get hyperty source code', function(done) {

    let hypertySourceCodeURL = _hypertyDescriptor.sourceCode;
    expect(runtimeCatalogue.getHypertySourceCode(hypertySourceCodeURL))
    .to.be.fulfilled.and.notify(done);

  });

  it('should get Stub descriptor', function(done) {

    //
    // guid, id, description, kind, catalogueURL,
    // sourceCode, dataObject, type, messageSchema,
    // policies, constraints, configuration,
    // hypertyCapabilities, protocolCapabilities
    //
    let descriptorValidation = [
      'guid', 'id', 'classname', 'description', 'kind', 'catalogueURL',
      'sourceCode', 'dataObject', 'type', 'messageSchema',
      'configuration', 'policies', 'constraints', 'hypertyCapabilities',
      'protocolCapabilities'
    ];

    // TODO: Check the hyperty descriptor response and compare
    // with what is defined in the specification;
    let domainURL = 'sp1.pt';
    expect(runtimeCatalogue.getStubDescriptor(domainURL).then(function(stubDescriptor) {
      _stubDescriptor = stubDescriptor;
      return _stubDescriptor;
    }))
    .to.be.fulfilled
    .and.eventually.to.have.all.keys(descriptorValidation)
    .and.eventually.with.deep.property('configuration')
    .that.to.have.all.keys('url', 'runtimeURL')
    .and.notify(done);

  });

  it('should get stub source code', function(done) {

    let stubSourceCodeURL = _stubDescriptor.sourceCode;
    expect(runtimeCatalogue.getStubSourceCode(stubSourceCodeURL))
    .to.be.fulfilled.and.notify(done);

  });

});
