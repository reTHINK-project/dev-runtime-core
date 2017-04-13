import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import DataObjectsStorage from '../src/store-objects/DataObjectsStorage';
import { runtimeFactory } from './resources/runtimeFactory';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

describe('dataObjectsStorage', function() {

  let storageManager;
  let dataObjectsStorage;
  let runtimeURL = 'hyperty-runtime://fake-runtime';
  let syncherManagerURL = runtimeURL + '/sm';

  let owner = 'hyperty://<domain>/id-owner';
  let resource = 'resource://obj1';
  let userURL = 'user://<domain>/<my-name>';
  let schema = 'schema://fake-schema-url';
  let schemaList = ['schema://fake-schema-url/Communication', 'schema://fake-schema-url/Context', 'schema://fake-schema-url/Connection'];

  before(() => {

    storageManager = runtimeFactory.storageManager();
    dataObjectsStorage = new DataObjectsStorage(storageManager, {});

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
    let childrens = {};
    childrens[owner + '#1'] = { message: 'message 1' };
    childrens[subscription + '#1'] = { message: 'message 2' }
    childrens[owner + '#2'] = { message: 'message 3' }

    expect(dataObjectsStorage.set(resource, isReporter, schema, status, owner))
    .to.have.keys('resource', 'isReporter', 'isToSaveData', 'subscriptions', 'subscriberUsers', 'childrens', 'data', 'version', 'schema', 'status', 'owner');

    expect(dataObjectsStorage.saveData(true, resource, null, data)).to.be.deep.equal({
      resource: resource,
      isReporter: isReporter,
      isToSaveData: false,
      subscriptions: [],
      subscriberUsers: [],
      childrens: {},
      data: data,
      version: 0,
      schema: schema,
      status: status,
      owner: owner
    });

    expect(dataObjectsStorage.saveChildrens(true, resource, null, childrens)).to.deep.equal({
      resource: resource,
      isReporter: isReporter,
      isToSaveData: false,
      subscriptions: [],
      subscriberUsers: [],
      schema: schema,
      status: status,
      owner: owner,
      data: data,
      childrens: childrens,
      version: 0
    })

    expect(dataObjectsStorage.update(isReporter, resource, 'subscriptions', subscription)).to.be.deep.equal({
      resource: resource,
      isReporter: isReporter,
      isToSaveData: false,
      subscriptions: [subscription],
      subscriberUsers: [],
      schema: schema,
      status: status,
      owner: owner,
      data: data,
      childrens: childrens,
      version: 0
    });

    done();

  });

  it('should set a bundle of information to be saved on storage like reporter', (done) => {

    let num = 4;

    for (let i = 0; i < num; i++) {

      let status = 'on';
      let isReporter = true;
      let resource = '<scheme>://<domain>/id-' + i;
      let rand = Math.round(Math.random() * 2);
      let randomSchema = schemaList[rand];
      let owner = 'hyperty://<domain>/id-' + (num - i);
      let subscription = 'hyperty://<domain>/id-' + ((num - i) * 2);

      // resource, isReporter, schema, status, data, subscription, children, childrenResources, subscriberUser
      expect(dataObjectsStorage.set(resource, isReporter, randomSchema, status, owner)).to.be.deep.equal({
        resource: resource,
        isReporter: isReporter,
        subscriptions: [],
        subscriberUsers: [],
        childrens: {},
        data: {},
        version: 0,
        schema: randomSchema,
        status: 'on',
        isToSaveData: false,
        owner: owner
      });

      expect(dataObjectsStorage.update(isReporter, resource, 'isToSaveData', true)).to.be.deep.equal({
        resource: resource,
        isReporter: isReporter,
        subscriptions: [],
        subscriberUsers: [],
        childrens: {},
        data: {},
        version: 0,
        schema: randomSchema,
        status: 'on',
        owner: owner,
        isToSaveData: true
      });

      expect(dataObjectsStorage.saveData(isReporter, resource, 'participants.1', {name: 'vitor', last: 'silva'})).to.be.deep.equal({
        resource: resource,
        isReporter: isReporter,
        subscriptions: [],
        subscriberUsers: [],
        schema: randomSchema,
        status: 'on',
        owner: owner,
        isToSaveData: true,
        childrens: {},
        version: 0,
        data: {
          participants: {
            1: {
              name: 'vitor', last: 'silva'
            }
          }
        }
      });

      expect(dataObjectsStorage.update(isReporter, resource, 'subscriptions', subscription)).to.be.deep.equal({
        resource: resource,
        isReporter: isReporter,
        subscriptions: [subscription],
        subscriberUsers: [],
        schema: randomSchema,
        status: 'on',
        owner: owner,
        isToSaveData: true,
        childrens: {},
        version: 0,
        data: {
          participants: {
            1: {
              name: 'vitor', last: 'silva'
            }
          }
        }
      });

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
      let resource = '<scheme>://<domain>/id-' + letters[i];
      let rand = Math.round(Math.random() * 2);
      let randomSchema = schemaList[rand];
      let subscription = 'hyperty://<domain>/id-' + letters[(num - i)];

      // resource, isReporter, schema, status, data, subscription, children, childrenResources, subscriberUser
      expect(dataObjectsStorage.set(resource, isReporter, randomSchema, status, owner, subscription)).to.be.deep.equal({
        resource: resource,
        isReporter: isReporter,
        subscriptions: [subscription],
        subscriberUsers: [],
        schema: randomSchema,
        status: 'on',
        isToSaveData: false,
        childrens: {},
        data: {},
        version: 0,
        owner: owner
      });

      if (i === num - 1) {
        done();
      }
    }

  });

  it('should update a resource with new Subscription', (done) => {
    let resource = '<scheme>://<domain>/id-2';
    let subscriptions = ['hyperty://<domain>/id-3', 'hyperty://<domain>/id-2'];
    let isReporter = true;

    expect(dataObjectsStorage.update(isReporter, resource, 'subscriptions', subscriptions[0]).subscriptions).to.contains(subscriptions[0], subscriptions[1]);

    // .to.have.deep.property('subscriptions', ['hyperty://<domain>/id-4', 'hyperty://<domain>/id-3']);

    // expect(dataObjectsStorage._storeDataObject[type][resource].subscriptions).to.contains(subscriptions[0], subscriptions[1]);
    done();
  });

  it('should update a resource with new Subscriber Users', (done) => {
    let resource = '<scheme>://<domain>/id-2';
    let isReporter = true;

    expect(dataObjectsStorage.update(isReporter, resource, 'subscriberUsers', userURL).subscriberUsers).to.contains(userURL);
    done();
  });

  // it('should update the data resource', (done) => {
  //   let resource = '<scheme>://<domain>/id-2';
  //   let isReporter = true;
  //   dataObjectsStorage.updateData(resource, 'subscriberUsers', userURL, isReporter);
  //
  //   let type = isReporter ? 'reporters' : 'observers';
  //
  //   expect(dataObjectsStorage._storeDataObject[type][resource].subscriberUsers).to.contains(userURL);
  //   done();
  // });

  it('should get specific dataObject by hypertyURL', (done) => {

    let msg = {
      type: 'create',
      from: 'hyperty://<domain>/id-2',
      to: syncherManagerURL
    };

    expect(dataObjectsStorage.getResourcesByCriteria(msg, true))
    .to.be.fulfilled
    .and.eventually.to.include.keys('<scheme>://<domain>/id-2')
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

    expect(dataObjectsStorage.getResourcesByCriteria(msg, true))
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

    expect(dataObjectsStorage.getResourcesByCriteria(msg, true))
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

    expect(dataObjectsStorage.getResourcesByCriteria(msg, true))
    .to.be.fulfilled
    .and.eventually.to.include.keys(resource)
    .and.notify(done);

  });

  it('should delete a specific value from specific resource', (done) => {
    let resource = '<scheme>://<domain>/id-3';
    let subscription = 'hyperty://<domain>/id-1';
    dataObjectsStorage.delete(resource, 'subscriptions', subscription);

    done();
  });

  it('should not delete a resource', (done) => {
    let resource = '<scheme>://<domain>/id-8';
    expect(dataObjectsStorage.deleteResource(resource)).to.be.fulfilled
    .and.eventually.to.be.eq('The ' + resource + ' dosen\t exists, nothing was deleted').and.notify(done);
  });

  it('should delete a resource', (done) => {
    let resource = '<scheme>://<domain>/id-1';
    expect(dataObjectsStorage.deleteResource(resource))
    .to.be.fulfilled
    .and.eventually.to.be.undefined.and.notify(done);
  });

});
