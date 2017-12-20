import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { runtimeFactory } from './resources/runtimeFactory';

import { generateGUID } from '../src/utils/utils';

import { generateData, buildResourceMessage } from './resources/generateData';

import HypertyResourcesStorage from '../src/hyperty-resources-storage/HypertyResourcesStorage';

import MessageBus from '../src/bus/MessageBus';

import { storage } from '../src/runtime/Storage';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

describe('Hyperty Resource Storage', function() {

  const runtimeURL = 'runtime://localhost/' + generateGUID();
  const storages = storage(runtimeFactory);

  const storageManager = storages.hypertyResources;

  const from = 'hyperty://localhost/' + generateGUID();
  const to = runtimeURL + '/storage';

  let bus;
  let hypertyResourcesStorage;
  let hypertyResources;

  before(function(done) {

    let registry = {
      isLocal: function() {
        return true;
      }
    };

    bus = new MessageBus(registry);

    storageManager.get().then(function(result) {

      hypertyResources = result || {};

      hypertyResourcesStorage = new HypertyResourcesStorage(runtimeURL, bus, storageManager, hypertyResources);
      hypertyResourcesStorage.checkStorageQuota().then(() => done());

    });

  });

  it('check available space', function(done) {

    expect(hypertyResourcesStorage.checkStorageQuota().then((result) => {

      expect(result).to.have.all.keys('quota', 'usage', 'percent');
      expect(result).to.have.property('percent').to.be.a('number');

    })).to.be.fulfilled.and.notify(done);

  });

  it('should add resources', function(done) {

    const generatedData = generateData('50MB');

    const msg = buildResourceMessage(from, to, runtimeURL, generatedData);

    const id = bus.postMessage(msg);

    bus.addResponseListener(from, id, (reply) => {
      bus.removeResponseListener(from, reply.id);

      expect(reply.body.code).to.be.equal(200, 'The message code should be 200');
      done();
    });

  });

  it('should multiple resources', function(done) {

    const max = 1;

    for (let i = 0; i <= max; i++) {
      const generatedData = generateData('5MB');

      const msg = buildResourceMessage(from, to, runtimeURL, generatedData);

      const id = bus.postMessage(msg);

      bus.addResponseListener(from, id, (reply) => {
        bus.removeResponseListener(from, reply.id);

        expect(reply.body.code).to.be.equal(200, 'The message code should be 200');

        if (i === max) {
          done();
        }

      });

    }


  });

  it('should have one resource with 50Mb', function(done) {

    console.log(hypertyResources);

    const b = Object.keys(hypertyResources)[0];
    expect(hypertyResources[b].size).to.be.equal(52428800, 'The size of resource should be 50Mb');
    done();

  });

  it('should add resources out of limit', function(done) {

    const from = 'hyperty://localhost/' + generateGUID();
    const generatedData = generateData('500MB');

    const msg = buildResourceMessage(from, to, runtimeURL, generatedData);

    const id = bus.postMessage(msg);

    bus.addResponseListener(from, id, function(reply) {

      bus.removeResponseListener(from, reply.id);

      expect(reply.body.code).to.be.equal(500, 'The message code should be 500');
      done();
    });

  });

});
