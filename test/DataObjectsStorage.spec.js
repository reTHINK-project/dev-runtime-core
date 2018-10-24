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
  let url = 'resource://obj1';
  let userURL = 'user://<domain>/<my-name>';
  let schema = 'schema://fake-schema-url';
  let schemaList = ['schema://fake-schema-url/Communication', 'schema://fake-schema-url/Context', 'schema://fake-schema-url/Connection'];

  before(() => {

//    storageManager = runtimeFactory.storageManager('syncherManager:ObjectURLs');
    storageManager = runtimeFactory.storageManager('syncherManager:ObjectURLs');
    dataObjectsStorage = new DataObjectsStorage(storageManager, {}, runtimeFactory);
    console.log('DataObjectStorageTests ', dataObjectsStorage);

  });

  it('should set dataObject information to be saved on storage', (done) => {

    let metadata = {};

    metadata.status = 'live';
    metadata.isReporter = true;
    let data = {
      x: 1,
      y: 2
    };
    metadata.schema = schema;
    metadata.url = url;
    metadata.name = 'WebRTC';
    metadata.subscriberUsers = [];
    metadata.subscriptions = [];
    metadata.version = 0;
    metadata.reporter = 'hyperty://<domain>/id-3';
    let subscriberHyperty = 'hyperty://<domain>/id-2';
    let childrenObjects = {};
    childrenObjects[metadata.reporter + '#1'] = { message: 'message 1' };
    childrenObjects[subscriberHyperty + '#1'] = { message: 'message 2' };
    childrenObjects[metadata.reporter + '#2'] = { message: 'message 3' };

    expect(dataObjectsStorage.set(metadata).then( function(result) {
      return result;
    }))
    .to.have.keys('url', 'isReporter', 'subscriberUsers', 'subscriptions', 'version', 'schema', 'status', 'reporter', 'name', 'childrenObjects', 'data');

    expect(dataObjectsStorage.saveData(true, url, null, data))
    .to.be.deep.equal({
      url: metadata.url,
      isReporter: metadata.isReporter,
      subscriptions: [],
      subscriberUsers: [],
      data: data,
      version: 0,
      schema: metadata.schema,
      status: metadata.status,
      reporter: metadata.reporter,
      childrenObjects: {},
      name: metadata.name
    });

    expect(dataObjectsStorage.saveChildrens(true, metadata.url, null, childrenObjects)).to.deep.equal({
      url: metadata.url,
      isReporter: metadata.isReporter,
      subscriptions: [],
      subscriberUsers: [],
      schema: metadata.schema,
      status: metadata.status,
      reporter: metadata.reporter,
      data: data,
      childrenObjects: childrenObjects,
      version: 0,
      name: metadata.name
    });

    expect(dataObjectsStorage.update(metadata.isReporter, metadata.url, 'subscriptions', subscriberHyperty)).to.be.deep.equal({
      url: metadata.url,
      isReporter: metadata.isReporter,
      subscriptions: [subscriberHyperty],
      subscriberUsers: [],
      schema: schema,
      status: metadata.status,
      reporter: metadata.reporter,
      data: data,
      childrenObjects: childrenObjects,
      version: 0,
      name: metadata.name
    });

    done();

  });

  it('should set a bundle of information to be saved on storage like reporter', (done) => {

    let num = 4;

    for (let i = 0; i < num; i++) {

      let metadata = {};

      metadata.status = 'live';
      metadata.version = 0;
      metadata.isReporter = true;
      metadata.url = '<scheme>://<domain>/id-' + i;
      let rand = Math.round(Math.random() * 2);
      metadata.schema = schemaList[rand];
      metadata.reporter = 'hyperty://<domain>/id-' + (num - i);
      let subscriberHyperty = 'hyperty://<domain>/id-' + ((num - i) * 2);

      // resource, isReporter, schema, status, data, subscription, children, childrenResources, subscriberUser
      expect(dataObjectsStorage.set(metadata)).to.be.deep.equal({
        url: metadata.url,
        isReporter: metadata.isReporter,
        subscriptions: [],
        subscriberUsers: [],
        childrenObjects: {},
        data: {},
        version: 0,
        schema: metadata.schema,
        status: metadata.status,
        reporter: metadata.reporter
      });

      expect(dataObjectsStorage.update(metadata.isReporter, metadata.url, 'store', true)).to.be.deep.equal({
        url: metadata.url,
        isReporter: metadata.isReporter,
        subscriptions: [],
        subscriberUsers: [],
        childrenObjects: {},
        data: {},
        version: 0,
        schema: metadata.schema,
        status: metadata.status,
        reporter: metadata.reporter,
        store: true
      });

      expect(dataObjectsStorage.saveData(metadata.isReporter, metadata.url, 'participants.1', {name: 'vitor', last: 'silva'})).to.be.deep.equal({
        url: metadata.url,
        isReporter: metadata.isReporter,
        subscriptions: [],
        subscriberUsers: [],
        childrenObjects: {},
        version: 0,
        schema: metadata.schema,
        status: metadata.status,
        reporter: metadata.reporter,
        store: true,
        data: {
          participants: {
            1: {
              name: 'vitor', last: 'silva'
            }
          }
        }
      });

      expect(dataObjectsStorage.update(metadata.isReporter, metadata.url, 'subscriptions', subscriberHyperty)).to.be.deep.equal({
        url: metadata.url,
        isReporter: metadata.isReporter,
        subscriptions: [subscriberHyperty],
        subscriberUsers: [],
        childrenObjects: {},
        version: 0,
        schema: metadata.schema,
        status: metadata.status,
        reporter: metadata.reporter,
        store: true,
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

      let metadata = {};

      metadata.status = 'live';
      metadata.version = 0;
      metadata.isReporter = false;
      metadata.url = '<scheme>://<domain>/id-' + letters[i];
      let rand = Math.round(Math.random() * 2);
      metadata.schema = schemaList[rand];
      metadata.reporter = 'hyperty://<domain>/id-' + (num - i);
      let subscriberHyperty = 'hyperty://<domain>/id-' + letters[(num - i)];

      // resource, isReporter, schema, status, data, subscription, children, childrenResources, subscriberUser
      expect(dataObjectsStorage.set(metadata)).to.be.deep.equal({
        url: metadata.url,
        isReporter: metadata.isReporter,
        subscriptions: [],
        subscriberUsers: [],
        childrenObjects: {},
        data: {},
        version: 0,
        schema: metadata.schema,
        status: metadata.status,
        reporter: metadata.reporter
      });

      if (i === num - 1) {
        done();
      }
    }

  });

  it('should update a resource with new Hyperty Subscribers', (done) => {
    let url = '<scheme>://<domain>/id-2';
    let hypertySubscribers = ['hyperty://<domain>/id-3', 'hyperty://<domain>/id-2'];
    let isReporter = true;

    expect(dataObjectsStorage.update(isReporter, url, 'hypertySubscribers', hypertySubscribers[0]).hypertySubscribers).to.contains(hypertySubscribers[0], hypertySubscribers[1]);

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
    .and.eventually.to.include.keys(url)
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
    .and.eventually.to.include.keys(url)
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
