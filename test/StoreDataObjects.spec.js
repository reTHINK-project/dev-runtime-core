import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import {generateGUID} from '../src/utils/utils';

import StoreDataObjects from '../src/syncher/StoreDataObjects';
import { runtimeFactory } from './resources/runtimeFactory';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

describe('StoreDataObjects', function() {

  let storageManager;
  let storeDataObjects;
  let runtimeURL = 'hyperty-runtime://fake-runtime';
  let syncherManagerURL = runtimeURL + '/sm';

  let resource = 'resource://obj1';
  let userURL = 'user://<domain>/<my-name>';
  let schema = 'schema://fake-schema-url';
  let schemaList = ['schema://fake-schema-url/Communication', 'schema://fake-schema-url/Context', 'schema://fake-schema-url/Connection'];

  before(() => {

    storageManager = runtimeFactory.storageManager();
    storeDataObjects = new StoreDataObjects(storageManager);

  });

  it('should set dataObject information to be saved on storage', (done) => {

    let status = 'on';
    let isReporter = true;
    let data = {
      x: 1,
      y: 2,
      name: 'WebRTC'
    };
    let subscription = 'hyperty://<domain>/id-3';

    // resource, isReporter, schema, status, data, subscription, children, childrenResources, subscriberUser
    storeDataObjects.set(resource, isReporter, schema, status, data, subscription);

    expect(storeDataObjects._storeDataObject[resource]).have.any.keys('resource', 'isReporter', 'schema');
    done();

  });

  it('should set a bundle of information to be saved on storage', (done) => {

    let num = 4;

    for (let i = 0; i < num; i++) {

      let status = 'on';
      let isReporter = Boolean(Math.round(Math.random() * 1));
      let data = {x: 1, y: 2};
      let resource = '<scheme>://<domain>/id-' + i;
      let rand = Math.round(Math.random() * 2);
      let randomSchema = schemaList[rand];
      let subscription = 'hyperty://<domain>/id-' + (num - i);

      // resource, isReporter, schema, status, data, subscription, children, childrenResources, subscriberUser
      storeDataObjects.set(resource, isReporter, randomSchema, status, data, subscription);

      expect(storeDataObjects._storeDataObject[resource]).have.any.keys('resource', 'isReporter', 'schema');
      done();

    }

  });

  it('should update an resource', (done) => {
    let resource = '<scheme>://<domain>/id-2';
    storeDataObjects.update(resource, 'subscriberUsers', userURL);

    expect(storeDataObjects._storeDataObject[resource].subscriberUsers).to.contains(userURL);
    done();
  });

  it('should get specific dataObject by hypertyURL', (done) => {

    let msg = {
      type: 'create',
      from: 'hyperty://<domain>/id-3',
      to: syncherManagerURL
    };

    expect(storeDataObjects.getResourcesByCriteria(msg))
    .to.be.fulfilled
    .and.eventually.to.include.keys('<scheme>://<domain>/id-1', 'resource://obj1')
    .and.notify(done);

  });

  it('should get specific dataObject by identity', (done) => {

    let msg = {
      type: 'create',
      from: 'hyperty://<domain>/id-3',
      to: syncherManagerURL,
      body: {
        identity: userURL
      }

    };

    expect(storeDataObjects.getResourcesByCriteria(msg))
    .to.be.fulfilled
    .and.eventually.to.include.keys('<scheme>://<domain>/id-2')
    .and.notify(done);

  });

  it('should get specific dataObject by schema', (done) => {

    let msg = {
      type: 'create',
      from: 'hyperty://<domain>/id-3',
      to: syncherManagerURL,
      body: {
        schema: schema
      }

    };

    expect(storeDataObjects.getResourcesByCriteria(msg))
    .to.be.fulfilled
    .and.eventually.to.include.keys(resource)
    .and.notify(done);

  });

  it('should get specific dataObject by some data', (done) => {

    let msg = {
      type: 'create',
      from: 'hyperty://<domain>/id-3',
      to: syncherManagerURL,
      body: {
        value: {
          name: 'WebRTC'
        }
      }

    };

    expect(storeDataObjects.getResourcesByCriteria(msg))
    .to.be.fulfilled
    .and.eventually.to.include.keys(resource)
    .and.notify(done);

  });

  it('should delete a specific value from specific resource', (done) => {
    let resource = '<scheme>://<domain>/id-3';
    let subscription = 'hyperty://<domain>/id-1';
    expect(storeDataObjects.delete(resource, 'subscriptions', subscription)).to.be.fulfilled.and.notify(done);
  });

  it('should delete a resource', (done) => {
    let resource = '<scheme>://<domain>/id-3';
    expect(storeDataObjects.deleteResource(resource)).to.be.fulfilled.and.notify(done);
  });

});
