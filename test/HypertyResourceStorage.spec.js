import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { runtimeFactory } from './resources/runtimeFactory';

import { generateGUID } from '../src/utils/utils';

import { generateData, buildResourceMessage } from './resources/generateData';

import HypertyResourcesStorage from '../src/hyperty-resources-storage/HypertyResourcesStorage';

import MessageBus from '../src/bus/MessageBus';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

describe('Hyperty Resource Storage', function() {

  const storageManager = runtimeFactory.storageManager();

  let runtimeURL = 'runtime://localhost/' + generateGUID();
  let bus;
  let hypertyResourcesStorage;

  before(function(done) {

    let registry = {
      isLocal: function() {
        return true;
      }
    };

    bus = new MessageBus(registry);

    let hypertyResources;

    storageManager.get('hypertyResources').then(function(result) {
      hypertyResources = result || {};

      hypertyResourcesStorage = new HypertyResourcesStorage(runtimeURL, bus, storageManager, hypertyResources);
      done();

    });

  });

  it('check available space', function(done) {

    expect(hypertyResourcesStorage.checkStorageQuota().then((result) => {

      expect(result).to.have.all.keys('quota', 'usage', 'percent');
      expect(result).to.have.property('percent').to.be.a('number');

    })).to.be.fulfilled.and.notify(done);

  });

  it('should add resources', function(done) {


    const from = 'hyperty://localhost/' + generateGUID();
    const generatedData = generateData('50MB');

    const msg = buildResourceMessage(from, runtimeURL, generatedData);

    const id = bus.postMessage(msg);

    bus.addResponseListener(from, id, (reply) => {
      bus.removeResponseListener(from, reply.id);

      expect(reply.body.code).to.be.equal(200, 'the message code is different of 200');
      done();
    });

  });

  it('should add resources out of limit', function(done) {

    const from = 'hyperty://localhost/' + generateGUID();
    const generatedData = generateData('100MB');

    const msg = buildResourceMessage(from, runtimeURL, generatedData);

    const id = bus.postMessage(msg);

    bus.addResponseListener(from, id, (reply) => {
      bus.removeResponseListener(from, reply.id);

      expect(reply.body.code).to.be.equal(500, 'the message code is different of 500');
      done();
    });

  });

});
