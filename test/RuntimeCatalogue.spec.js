import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

let expect = chai.expect;

chai.config.truncateThreshold = 0;
chai.use(chaiAsPromised);
chai.use(sinonChai);

import RuntimeCatalogue from '../src/runtime-catalogue/RuntimeCatalogue';
import {runtimeFactory} from './resources/runtimeFactory';

import HypertyDescriptor from '../src/runtime-catalogue/HypertyDescriptor';
import ProtocolStubDescriptor from '../src/runtime-catalogue/ProtocolStubDescriptor';
import HypertyRuntimeDescriptor from '../src/runtime-catalogue/HypertyRuntimeDescriptor';
import DataObjectSchema from '../src/runtime-catalogue/DataObjectSchema';
import SourcePackage from '../src/runtime-catalogue/SourcePackage';

import {divideURL} from '../src/utils/utils';

/**
 * PLEASE NOTE:
 * This test requires locally running Catalogue Broker and Catalogue Database,
 * using the default catalogue_objects folder.
 *
 * Start the Catalogue Broker with:
 *      sudo java -jar catalogue_broker/target/rethink-catalogue-broker-*-jar-with-dependencies.jar -http 80
 *
 * Start the Catalogue Database with:
 *      java -jar catalogue_database/target/rethink-catalogue-database-*-jar-with-dependencies.jar -usehttp
 */

// Testing RuntimeCatalogue
describe('Runtime Catalogue', function () {
  let domain = 'localhost';
  let hypertyName = "FirstHyperty";
  let protostubName = "FirstProtostub";
  let runtimeName = "FirstRuntime";
  let schemaName = "FirstDataSchema";
  let idpproxyName = "FirstProxy";

//  let runtimeFactory = new RuntimeFactory();

  let runtimeCatalogue = new RuntimeCatalogue(runtimeFactory, 'runtimeCatalogue');
  runtimeCatalogue.runtimeURL = domain;
  let tempHypertyDescriptor;

  it('should get hyperty descriptor', function (done) {
    let hypertyDescriptorURL = 'hyperty-catalogue://' + domain + '/.well-known/hyperty/' + hypertyName;
    expect(runtimeCatalogue.getHypertyDescriptor(hypertyDescriptorURL).then((hypertyDescriptor) => {
      //console.info("getHypertyDescriptor returned:", JSON.stringify(hypertyDescriptor, null, 2));
      tempHypertyDescriptor = hypertyDescriptor;
      return hypertyDescriptor;
    })).to.eventually.be.instanceof(HypertyDescriptor).and.notify(done);
  });

  it('should get sourcePackage', function (done) {
    expect(runtimeCatalogue.getSourcePackageFromURL(tempHypertyDescriptor.sourcePackageURL).then((sourcePackage) => {
      //console.info("getSourcePackageFromURL returned:", JSON.stringify(sourcePackage, null, 2));
      return sourcePackage;
    })).to.eventually.be.instanceof(SourcePackage).and.notify(done);
  });


  it('should get hyperty source code', function (done) {
    expect(runtimeCatalogue.getSourceCodeFromDescriptor(tempHypertyDescriptor).then((sourceCode) => {
      //console.info("getSourceCodeFromDescriptor returned:", sourceCode);
      return sourceCode;
    })).to.be.fulfilled.and.notify(done);

  });

  it('should get protostub descriptor', function (done) {
    let protostubURL = 'hyperty-catalogue://' + domain + '/.well-known/protocolstub/' + protostubName;
    expect(runtimeCatalogue.getStubDescriptor(protostubURL).then((protostub) => {
      //console.info("getStubDescriptor returned:", JSON.stringify(protostub, null, 2));
      return protostub;
    })).to.eventually.be.instanceof(ProtocolStubDescriptor).and.notify(done);
  });

  it('should get runtime descriptor', function (done) {
    let runtimeURL = 'hyperty-catalogue://' + domain + '/.well-known/runtime/' + runtimeName;
    expect(runtimeCatalogue.getRuntimeDescriptor(runtimeURL).then((runtime) => {
      //console.info("getRuntimeDescriptor returned:", JSON.stringify(runtime, null, 2));
      return runtime;
    })).to.eventually.be.instanceof(HypertyRuntimeDescriptor).and.notify(done);
  });

  it('should get dataschema descriptor', function (done) {
    let schemaURL = 'hyperty-catalogue://' + domain + '/.well-known/dataschema/' + schemaName;
    expect(runtimeCatalogue.getDataSchemaDescriptor(schemaURL).then((schemaDescriptor) => {
      //console.info("getDataSchemaDescriptor returned:", JSON.stringify(schemaDescriptor, null, 2));
      return schemaDescriptor;
    })).to.eventually.be.instanceof(DataObjectSchema).and.notify(done);
  });

  it('should get idpproxy descriptor', function (done) {
    let protostubURL = 'hyperty-catalogue://' + domain + '/.well-known/idp-proxy/' + idpproxyName;
    expect(runtimeCatalogue.getIdpProxyDescriptor(protostubURL).then((proxyDescriptor) => {
      //console.info("getIdpProxyDescriptor returned:", JSON.stringify(proxyDescriptor, null, 2));
      return proxyDescriptor;
    })).to.eventually.be.instanceof(ProtocolStubDescriptor).and.notify(done);
  });

  it('should NOT get hyperty', function (done) {
    let hypertyDescriptorURL = 'someInvalidURL';
    expect(runtimeCatalogue.getHypertyDescriptor(hypertyDescriptorURL).then((hypertyDescriptor) => {
      //console.info("getHypertyDescriptor returned:", JSON.stringify(hypertyDescriptor, null, 2));
      tempHypertyDescriptor = hypertyDescriptor;
      return hypertyDescriptor;
    })).to.be.rejected.and.notify(done);
  });

});
