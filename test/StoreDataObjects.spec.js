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
    let owner = 'hyperty://<domain>/id-3';
    let subscription = 'hyperty://<domain>/id-2';

    storeDataObjects.set(resource, isReporter, schema, status, data, owner);
    storeDataObjects.update(resource, 'subscriptions', subscription, isReporter);

    expect(storeDataObjects._storeDataObject.reporters[resource]).have.any.keys('resource', 'isReporter', 'schema');
    done();

  });

  it('should set a bundle of information to be saved on storage like reporter', (done) => {

    let num = 4;

    for (let i = 0; i < num; i++) {

      let status = 'on';
      let isReporter = true;
      let data = {x: 1, y: 2};
      let resource = '<scheme>://<domain>/id-' + i;
      let rand = Math.round(Math.random() * 2);
      let randomSchema = schemaList[rand];
      let owner = 'hyperty://<domain>/id-' + (num - i);
      let subscription = 'hyperty://<domain>/id-' + ((num - i) * 2);

      let type = isReporter ? 'reporters' : 'observers';

      // resource, isReporter, schema, status, data, subscription, children, childrenResources, subscriberUser
      storeDataObjects.set(resource, isReporter, randomSchema, status, data, owner);
      storeDataObjects.update(resource, 'subscriptions', subscription, isReporter);

      expect(storeDataObjects._storeDataObject[type][resource]).have.any.keys('resource', 'isReporter', 'schema');

      if (i === num - 1) {
        console.log('DONE', i);
        done();
      }
    }

  });

  it('should set a bundle of information to be saved on storage like observers', (done) => {

    let num = 4;
    let letters = ['A', 'B', 'C', 'D'];

    for (let i = 0; i < num; i++) {

      let status = 'on';
      let isReporter = false;
      let data = {x: 1, y: 2};
      let resource = '<scheme>://<domain>/id-' + letters[i];
      let rand = Math.round(Math.random() * 2);
      let randomSchema = schemaList[rand];
      let subscription = 'hyperty://<domain>/id-' + letters[(num - i)];

      let type = isReporter ? 'reporters' : 'observers';

      // resource, isReporter, schema, status, data, subscription, children, childrenResources, subscriberUser
      storeDataObjects.set(resource, isReporter, randomSchema, status, data, subscription);

      expect(storeDataObjects._storeDataObject[type][resource]).have.any.keys('resource', 'isReporter', 'schema');

      if (i === num - 1) {
        done();
      }
    }

  });

  it('should update a resource with new Subscription', (done) => {
    let resource = '<scheme>://<domain>/id-2';
    let subscriptions = ['hyperty://<domain>/id-3', 'hyperty://<domain>/id-2'];
    let isReporter = true;
    let type = isReporter ? 'reporters' : 'observers';

    storeDataObjects.update(resource, 'subscriptions', subscriptions[0], isReporter);
    storeDataObjects.update(resource, 'subscriptions', subscriptions[1], isReporter);

    console.log('AQUI: ', storeDataObjects._storeDataObject[type][resource]);

    expect(storeDataObjects._storeDataObject[type][resource].subscriptions).to.contains(subscriptions[0], subscriptions[1]);
    done();
  });

  it('should update a resource with new Subscriber Users', (done) => {
    let resource = '<scheme>://<domain>/id-2';
    let isReporter = true;
    storeDataObjects.update(resource, 'subscriberUsers', userURL, isReporter);

    let type = isReporter ? 'reporters' : 'observers';

    expect(storeDataObjects._storeDataObject[type][resource].subscriberUsers).to.contains(userURL);
    done();
  });

  // it('should update the data resource', (done) => {
  //   let resource = '<scheme>://<domain>/id-2';
  //   let isReporter = true;
  //   storeDataObjects.updateData(resource, 'subscriberUsers', userURL, isReporter);
  //
  //   let type = isReporter ? 'reporters' : 'observers';
  //
  //   expect(storeDataObjects._storeDataObject[type][resource].subscriberUsers).to.contains(userURL);
  //   done();
  // });

  it('should get specific dataObject by hypertyURL', (done) => {

    let msg = {
      type: 'create',
      from: 'hyperty://<domain>/id-2',
      to: syncherManagerURL
    };

    expect(storeDataObjects.getResourcesByCriteria(msg, true))
    .to.be.fulfilled
    .and.eventually.to.include.keys('<scheme>://<domain>/id-3', 'resource://obj1')
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

    expect(storeDataObjects.getResourcesByCriteria(msg, true))
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

    expect(storeDataObjects.getResourcesByCriteria(msg, true))
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

    expect(storeDataObjects.getResourcesByCriteria(msg, true))
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
