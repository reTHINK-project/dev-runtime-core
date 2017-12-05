import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { runtimeFactory } from './resources/runtimeFactory';

import { generateGUID } from '../src/utils/utils';

import { generateData } from './resources/generateData';

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
    bus = new MessageBus();

    let hypertyResources;

    storageManager.set('hypertyResources', 1, {}).then(function() {

      storageManager.get('hypertyResources').then(function(result) {
        hypertyResources = result || {};

        hypertyResourcesStorage = new HypertyResourcesStorage(runtimeURL, bus, storageManager, hypertyResources);
        done();

      });

    });

  });

  it('check available space', function(done) {

    expect(hypertyResourcesStorage.checkStorageQuota().then((result) => {

      expect(result).to.have.all.keys('quota', 'usage', 'percent');
      expect(result).to.have.property('percent').to.be.a('number');
      expect(result).to.have.property('percent').to.not.be.greaterThan(100, 'You don\'t have left space on the storage');

    })).to.be.fulfilled.and.notify(done);

  });

  it('should add resources', function(done) {

    const from = 'hyperty://localhost/' + generateGUID();
    const p2pHandler = runtimeURL + 'p2phandler/' + generateGUID();
    const dataObjectURL = 'comm://localhost/' + generateGUID();

    let msg = {
      type: 'create',
      from: from,
      to: runtimeURL + '/storage',
      body: {
        auth: false,
        identity: { userProfle: {} },
        value: {
          children: 'resources',
          p2pHandler: p2pHandler,
          parent: dataObjectURL,
          runtime: runtimeURL,
          schema: 'hyperty-catalogue://catalogue.localhost/.well-known/dataschema/Communication',
          reporter: from
        }
      }
    };


    for (let i = 0; i < 2; i++) {
      const generatedData = generateData();

      console.log(generatedData);

      const resource = {
        content: generatedData,
        created: generatedData.lastModifiedDate,
        lastModified: generatedData.lastModifiedDate,
        mimetype: generatedData.type,
        name: generatedData.name,
        resourceType: 'file',
        size: generatedData.size,
        url: from + '#' + i
      };

      Object.assign(msg.body.value, resource);
      const id = bus.postMessage(msg);

      console.log('msg:', msg);

      bus.addResponseListener(from, id, (reply) => {
        console.log('AQUI:', reply);
        bus.removeResponseListener(from, reply.id);

        done();
      });

    }

  });

});
