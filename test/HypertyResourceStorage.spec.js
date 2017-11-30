import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { runtimeFactory } from './resources/runtimeFactory';

import HypertyResourcesStorage from '../src/hyperty-resources-storage/HypertyResourcesStorage';
import MessageBus from '../src/bus/MessageBus';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

describe('Hyperty Resource Storage', function() {

  let runtimeURL = 'hyperty-runtime://domain/a1';
  let bus;
  let hypertyResourcesStorage;

  before(function(done) {
    const bus = new MessageBus();
    const storageManager = runtimeFactory.storageManager();

    let hypertyResources;

    storageManager.get('hypertyResources').then(function(result) {
      hypertyResources = result;

      hypertyResourcesStorage = new HypertyResourcesStorage(runtimeURL, bus, storageManager, hypertyResources);

      done();

    });

  });

  it('check available space', function(done) {
    // .to.eventually.to.have.all.keys(hypertyResolved)

    expect(hypertyResourcesStorage.checkStorageQuota())
      .and.to.be.fulfilled
      .and.to.eventually.to.have.all.keys('quota', 'usage', 'available')
      .and.notify(done);

  });

})
