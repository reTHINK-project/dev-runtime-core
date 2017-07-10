import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

chai.config.truncateThreshold = 0;

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

import { descriptors } from './resources/descriptors.js';
import { runtimeFactory } from './resources/runtimeFactory';
import { generateGUID } from '../src/utils/utils';
import {Syncher, DataObjectReporter, DataObjectObserver} from 'service-framework/dist/Syncher';
import {divideURL} from '../src/utils/utils';


import RuntimeUA from  '../dist/Runtime.js';

describe('RuntimeUA', function() {
  let guid = generateGUID();
  let domain = 'localhost';
  let runtimeURL = 'hyperty-runtime://'+ domain +'/'+guid;
  let schemaURL = 'hyperty-catalogue://' + domain + '/.well-known/dataschema/Communication';
  let hypertyURL1 = 'hyperty://' + domain + '/' + guid + '-hyperty1';
  let hypertyURL2 = 'hyperty://' + domain + '/' + guid + '-hyperty2';
  let runtime = new RuntimeUA(descriptors.Runtimes.Runtime, runtimeFactory, domain);
  let storageManager = runtimeFactory.storageManager();
  let dataObjectsStorage;
  let identityModule;
  let aa;
  let registry;
  let catalog;
  let bus;
  let allocator;
  let msgNodeResponseFunc;
  let policyEngine;
  let handlers;
  let getDescriptor;
  let initialData = {
    communication: { name: 'chat-x' },
    x: 10, y: 10
  };

  before(() => {

    registry = {
      registerHyperty: () => {},
      checkRegisteredURLs: (info) => {
        return new Promise((resolve) => {
          console.log('info', info)

          if (info.reporter.length === 0) {
            resolve('hyperty://' + domain + '/' + guid);
          } else {
            resolve('comm://' + domain + '/' + guid);
          }
        });
      }
    };
    let seq = 0;
    bus = {
      postMessage: (msg, replyCallback) => {
        console.log(seq, '->', msg);
        seq++;

        if (!msg.body.scheme) { msg.body.scheme = 'hyperty'; }

        replyCallback({
          id: 1, type: 'response', from: 'domain://msg-node.'+ domain +'/address-allocation', to: msg.to,
          body: {code: 200, value: {allocated: msg.body.scheme + '://' + domain + '/' + guid + '-hyperty2'} }
        });

      },
      addListener: (url, callback) => {
        console.log('addListener', url, callback);
      }
    };

    getDescriptor = (url) => {

      return new Promise(function(resolve, reject) {

        console.log('get descriptor: ', url);

        let dividedURL = divideURL(url);
        let identity = dividedURL.identity;

        if (!identity) {
          identity = 'default';
        } else {
          identity = identity.substring(identity.lastIndexOf('/') + 1);
        }

        let result;

        if (url.includes('hyperty')) {
          try {
            result = descriptors.Hyperties[identity];
          } catch (e) {
            reject(e);
          }

        } else if (url.includes('protocolstub') || url === dividedURL.domain) {
          try {
            result = descriptors.ProtoStubs[identity];
          } catch (e) {
            reject(e);
          }
        } else if (url.includes('idp-proxy')) {
          try {
            result = descriptors.IdpProxies[identity];
          } catch (e) {
            reject(e);
          }
        } else if (url.includes('dataschema')) {
          try {
            result = descriptors.DataSchemas[identity];
          } catch (e) {
            reject(e);
          }

        }

        resolve(result);

      });
    };

    allocator = {
      create: () => {
        return new Promise((resolve) => {
          resolve({address: [objURL]});
        });
      }
    };
    identityModule = {
      decryptMessage: (message) => {
        return new Promise((resolve) => {
          resolve(message);
        });
      },
      encryptMessage: (message) => {
        return new Promise((resolve) => {
          resolve(message);
        });
      },
      getToken: () => {
        return new Promise((resolve) => {
          resolve({ userProfile: {username: 'user@domain' } });
        });
      }
    };

    handlers = [

      // Policy message authorise
      function(ctx) {
        policyEngine.authorise(ctx.msg).then(function(changedMgs) {

          changedMgs.body.identity = {
            userProfile: {
              userURL: 'user://user@domain.pt'
            }
          };

          ctx.msg = changedMgs;
          ctx.next();
        }).catch(function(reason) {
          console.error(reason);
          ctx.fail(reason);
        });
      }
    ];

  });
  msgNodeResponseFunc = (bus, msg) => {
    console.log('NEW MESSAEGE ', msg);
    if (msg.type === 'subscribe') {
      if (msg.id === 2) {
        //reporter subscribe
        expect(msg).to.contain.all.keys({
          id: 2, type: 'subscribe', from: 'hyperty-runtime://fake-runtime/sm', to: 'domain://msg-node.h1.domain/sm',
          body: { resources: [objURL + '/children/children1', objURL + '/children/children2'], source: hyperURL1 }
        });
      } else {
        //observer subscribe
        expect(msg).to.contain.all.keys({
          id: 5, type: 'subscribe', from: 'hyperty-runtime://fake-runtime/sm', to: 'domain://msg-node.obj1/sm',
          body: { resources: [objURL + '/changes', objURL + '/children/children1', objURL + '/children/children2'], source: hyperURL2 }
        });
      }

      //simulate msg-node response
      bus.postMessage({
        id: msg.id, type: 'response', from: msg.to, to: msg.from,
        body: { code: 200, value:{ url: 'comm://' + domain + '/' + guid+ '-hyperty2' }}
      });
    }
  };

  it('should load Runtime with success', (done) => {
    expect(runtime.init().then((result) => {

      let pipe = runtime.messageBus.pipeline;
      bus.pipeline = pipe;

      dataObjectsStorage = runtime._dataObjectsStorage;
      policyEngine = runtime.policyEngine;
      // runtime.messageBus = bus;
      // runtime.addressAllocation._bus = bus;
      //runtime.addressAllocation._registry = runtime.registry;
      console.log('Runtime', runtime);

      sinon.stub(runtime.descriptorInstance, 'getHypertyDescriptor', (hypertyURL) => {
        return getDescriptor(hypertyURL);
      });

      sinon.stub(runtime.descriptorInstance, 'getStubDescriptor', (stubURL) => {
        return getDescriptor(stubURL);
      });

      sinon.stub(runtime.descriptorInstance, 'getIdpProxyDescriptor', (idpProxyURL) => {
        return getDescriptor(idpProxyURL);
      });

      sinon.stub(runtime.runtimeCatalogue, 'getDataSchemaDescriptor', (dataSchemaURL) => {
        return new Promise((resolve, reject) => {
          if (schema) {
            resolve({ sourcePackage: { sourceCode: {
              properties: {
                scheme: { constant: 'resource' },
                children: { constant: ['children1', 'children2'] }
              }
            }}});
          } else {
            reject('No schema provided');
          }
        });
      });

      sinon.stub(runtime.registry, 'registerHyperty', (sandbox, descriptorURL, descriptor, addressURL) => {
        return new Promise(function(resolve) {
          console.log('AQIO:', addressURL);
          if (addressURL.newAddress) {
            resolve('hyperty://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21d');
          } else {
            resolve(addressURL.address);
          }
        });

      });

      sinon.stub(runtime.registry, 'checkRegisteredURLs', (info, reuseURL) => {

        return new Promise((resolve) => {
          console.log('checkRegisteredURLs:', typeof(reuseURL), reuseURL);
          if (typeof(reuseURL) === 'boolean') {
            resolve('hyperty://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21d');
          } else if (typeof(reuseURL) === 'string') {
            console.log('checkRegisteredURLs is string:', reuseURL);
            resolve(reuseURL);
          } else {
            resolve('hyperty://sp.domain/9c8c1949-e08e-4554-b201-bab201bdb21d');
          }

        });

      });

      sinon.stub(runtime.registry, 'registerStub', (sandbox, stubID, p2pConfig, descriptorURL, descriptor) => {
        console.log('HELLO:', runtime.registry.protostubsList, descriptor, stubID);

        return new Promise((resolve, reject) => {
          runtime.registry.protostubsList[stubID] = {
            url: stubID,
            status: 'deployed'
          };
        })
      })

      return result;
    }))
    .to.be.fulfilled
    .and.to.eventually.be.true
    .and.notify(done);
  });


  it('should create a new hyperty address for Reporter', function(done) {

    let number = 1;
    let info = {
      name: 'test',
      schema: 'hyperty-catalogue://' + domain + '/.well-known/dataschema/hello',
      reporter: [],
      resources: []
    };

    runtime.addressAllocation.create(domain, number, info, 'hyperty').then((a) => {
      console.log('a:', a);
    }).catch((re) => {
      console.error(re);
    })

    // expect(runtime.addressAllocation.create(domain, number, info, 'hyperty'))
    // .eventually.to.eql({newAddress: true, address: 'hyperty://' + domain + '/' + guid + '-hyperty2'})
    // .notify(done);
  });

  it('should create a new data Object address', function(done) {

    let number = 2;
    let scheme = 'comm';
    let info = {
      name: 'dataObjectName',
      schema: 'hyperty-catalogue://' + domain + '/.well-known/dataschema/communication',
      reporter: ['comm://' + domain + '/' + guid],
      resources: ['chat']
    };


    runtime.addressAllocation.create(domain, number, info, scheme).then((a) => {
      console.log('a:', a);
    }).catch((re) => {
      console.error(re);
    })

    // expect(runtime.addressAllocation.create(domain, number, info, scheme))
    // .eventually.to.eql({newAddress: true, address: 'comm://' + domain + '/' + guid+ '-hyperty2'})
    // .notify(done);
  });


  it.skip('reporter read', function(done) {
    let msgBus = runtime.messageBus;

    bus._onPostMessage = (msg) => {
      console.log('_onPostMessage: ', msg);
      msgNodeResponseFunc(msgBus, msg);
    };

    let sync2 = new Syncher(hypertyURL2, msgBus, { runtimeURL: runtimeURL });
    let sync1 = new Syncher(hypertyURL1, msgBus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [], initialData).then((dor) => {
      console.log('on-create-reply', dor.onRead);
      dor.onRead((event) => {
        console.log('on-read');
        event.accept();
      });

      sync2.read(dor.url).then((data) => {
        console.log('on-read-reply', data);
        expect(data.data).to.contain.all.keys({ communication: { name: 'chat-x' }, x: 10, y: 10 });
        done();
      });
    });
  });


  it('Data Synch', function(done) {
    let msgBus = runtime.messageBus;

    msgBus.pipeline.handlers = handlers;

    msgBus._onPostMessage = (msg) => {
      console.log('_onPostMessage: ', msg);
      msgNodeResponseFunc(msgBus, msg);
    };

    let sync2 = new Syncher(hypertyURL2, msgBus, { runtimeURL: runtimeURL });
    sync2.onNotification((notifyEvent) => {
      console.log('on-create-notify: ', notifyEvent);

      notifyEvent.ack();

      sync2.subscribe(schemaURL, notifyEvent.url, true, false).then((doo) => {
        console.log('on-subscribe-reply', doo, doo.data);
        doo.onChange('*', (changeEvent) => {
          console.log('on-change: ', JSON.stringify(changeEvent));
          expect(changeEvent).to.contain.all.keys({ cType: 'add', oType: 'object', field: 'test', data: ['a', 'b', 'c'] });
          expect(doo.data).to.contain.all.keys({ communication: { name: 'chat-x' }, x: 10, y: 10, test: ['a', 'b', 'c'] });
          done();
        });
      });

    });

    let sync1 = new Syncher(hypertyURL1, msgBus, { runtimeURL: runtimeURL });
    sync1.create(schemaURL, [hypertyURL2], initialData,true, false, 'MyTest', {}, {resources: ['chat']}).then((dor) => {
      console.log('on-create-reply', dor);
    //dor.inviteObservers([hypertyURL2]);

      dor.onRead((event) => {
        console.log('on-read');
        event.accept();
      });

      dor.onSubscription((subscribeEvent) => {
        console.log('on-resources: ', subscribeEvent);

        //we may have some problems in the time sequence here.
        //change-msg can reach the observer first
        subscribeEvent.accept();

        // TODO: We had the settimeout because when the proxyobserve trigger will trigger with this version of object..
        // this hack should make it trigger in next cycle;
        setTimeout(() => {
          dor.data.test = ['a', 'b', 'c'];
        });

      });
    }).catch(function(error) {
      console.log('Error creating reporter', error);
    });

  });

});
