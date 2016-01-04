import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

let expect = chai.expect;

chai.config.truncateThreshold = 0;
chai.use(chaiAsPromised);
chai.use(sinonChai);

import RuntimeCatalogue from '../src/runtime/RuntimeCatalogue';

// Testing runtimeUA;
describe('Runtime Catalogue', function() {

  let _hypertyDescriptor;
  let _stubDescriptor;

  let runtimeCatalogue = new RuntimeCatalogue();

  before(function() {

    let Hyperties = {
      HelloHyperty: {
        guid:'guid',
        id:'HelloHyperty',
        classname:'activate',
        description:'description of Hello Hyperty',
        kind:'hyperty',
        catalogueURL:'....',
        sourcePackageURL:'../resources/descriptors/HelloHyperty-sourcePackageURL.json',
        dataObject:'',
        type:'',
        messageSchema:'',
        policies:'',
        constraints:'',
        hypertyCapabilities:'',
        protocolCapabilities:''
      },
      WorldHyperty:{
        guid:'guid',
        id:'WorldHyperty',
        classname:'activate',
        description:'description of World Hyperty',
        kind:'hyperty',
        catalogueURL:'....',
        sourcePackageURL:'../resources/descriptors/WorldHyperty-sourcePackageURL.json',
        dataObject:'',
        type:'',
        messageSchema:'',
        policies:'',
        constraints:'',
        hypertyCapabilities:'',
        protocolCapabilities:''
      }
    };

    let ProtoStubs = {
      'sp.domain': {
        guid: 'guid',
        id: 'VertxProtoStub',
        classname: 'activate',
        description: 'description of ProtoStub',
        kind: 'Protostub',
        catalogueURL: '....',
        sourcePackageURL: '../resources/descriptors/VertxProtoStub-sourcePackageURL.json',
        dataObject: '',
        type: '',
        messageSchema: '',
        configuration: {
          url: 'wss://msg-node.ua.pt:9090/ws'
        },
        policies: '',
        constraints: '',
        hypertyCapabilities: '',
        protocolCapabilities: ''
      }
    };

    // Mockup the source code request
    let mockup = {
      encoding: 'UTF-8',
      sourceCodeClasname: 'HelloHyperty',
      sourceCode: '',
      signature: ''
    };

    let mockupHypertyDescriptor = sinon.stub(runtimeCatalogue, 'mockupHypertyDescriptor');
    mockupHypertyDescriptor.returns(new Promise(function(resolve, reject) {
      runtimeCatalogue.Hyperties = Hyperties;
      resolve(Hyperties);
    }));

    let mockupStubDescriptor = sinon.stub(runtimeCatalogue, 'mockupStubDescriptor');
    mockupStubDescriptor.returns(new Promise(function(resolve, reject) {
      runtimeCatalogue.ProtoStubs = ProtoStubs;
      resolve(ProtoStubs);
    }));

    let tes = sinon.stub(runtimeCatalogue, '_makeExternalRequest');
    tes.returns(new Promise(function(resolve, reject) {
      resolve(JSON.stringify(mockup));
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
      'sourcePackageURL', 'dataObject', 'type', 'messageSchema',
      'policies', 'constraints', 'hypertyCapabilities',
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

    let sourcePackageURL = _hypertyDescriptor.sourcePackageURL;
    expect(runtimeCatalogue.getHypertySourcePackage(sourcePackageURL))
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
      'sourcePackageURL', 'dataObject', 'type', 'messageSchema',
      'configuration', 'policies', 'constraints', 'hypertyCapabilities',
      'protocolCapabilities'
    ];

    // TODO: Check the hyperty descriptor response and compare
    // with what is defined in the specification;
    let domainURL = 'sp.domain';
    expect(runtimeCatalogue.getStubDescriptor(domainURL).then(function(stubDescriptor) {
      console.log('stubDescriptor: ', stubDescriptor);
      _stubDescriptor = stubDescriptor;
      return _stubDescriptor;
    }))
    .to.be.fulfilled
    .and.eventually.to.have.all.keys(descriptorValidation)
    .and.eventually.with.deep.property('configuration')
    .that.to.have.all.keys('url')
    .and.notify(done);

  });

  it('should get stub source code', function(done) {

    let sourcePackageURL = _stubDescriptor.sourcePackageURL;
    expect(runtimeCatalogue.getStubSourcePackage(sourcePackageURL))
    .to.be.fulfilled.and.notify(done);

  });

});
