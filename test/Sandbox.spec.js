import chai from 'chai';
var expect = chai.expect;

// testing dependecie
import request from '../src/utils/request';

import Sandbox from '../src/sandbox/Sandbox';
import Registry from '../src/registry/Registry';
import MessageBus from '../src/bus/MessageBus';

describe('Sandbox', function() {

  let registry = new Registry();
  let messageBus = new MessageBus(registry);
  let sandbox;
  let componentSourceCode;

  before(function() {
    return request.get('build/VertxProtoStub.js').then(function(result) {
      componentSourceCode = result;
      return result;
    }).catch(function(error) {
      componentSourceCode = error;
      console.log('Error: ', error);
    });
  });

  describe('constructor()', function() {

    it('should throw when given no arguments', function() {
      expect(function() {
        sandbox = new Sandbox(messageBus);
      }).to.not.throw();
    });

    it('should be passed message bus', function() {
      expect(sandbox.messageBus).to.exist.and.to.be.instanceof(MessageBus);
    });

    it('should have a sandbox instance', function() {
      expect(sandbox.sandbox).to.be.instanceof(Worker);
    });

  });

  describe('deployComponent()', function() {

    let componentURL = 'hyperty-runtime://sp1/protostub/123';
    let configuration = {
      url: 'ws://193.136.93.114:9090/ws',
      runtimeURL: 'runtime:/alice'
    };

    it('testing parameters', function() {
      expect(componentSourceCode).to.be.a('string');
      expect(componentURL).to.be.a('string');
      expect(configuration).to.be.a('object');
    });

    it('configuration parameter should have url and runtimeURL keys', function() {
      expect(configuration).to.have.any.keys('url', 'runtimeURL');
    });

    it('should throw when given no arguments', function() {
      expect(sandbox.deployComponent).to.throw();
    });

    it('should be a Promise', function() {
      expect(sandbox.deployComponent(componentSourceCode, componentURL, configuration)).to.be.instanceof(Promise);
    });

    context('should post a messsage into the sandbox and receive the response', function() {

      it('postMessage()', function() {
        let message = {
          sourceCode: componentSourceCode,
          componentURL: componentURL,
          configuration: configuration
        };

        expect(message).to.have.any.keys('sourceCode', 'componentURL', 'configuration');

        sandbox.sandbox.postMessage(message);

      });

      it('onMessage()', function(done) {
        sandbox.sandbox.addEventListener('message', function(event) {
          let message = event.data;

          expect(message).to.contain.any.keys('header', 'body');

          // TODO: verify the message format parameters
          // expect(message.header).to.contain.any.keys('id', 'type', 'from', 'to');
          // expect(message.body).to.contain.any.keys('value');
          done();
        });

      });

    });

  });

  // TODO: develop removeComponent
  describe('removeComponent()', function() {

    it('should be defined and throw when given no arguments', function() {
      expect(sandbox.removeComponent).to.not.be.an('undefined');
      expect(sandbox.removeComponent).to.throw(/Component URL parameter needed/);
    });

    context('testing the remove component', function() {

      it('should remove', function() {
        let componentURL = 'hyperty-runtime://sp1/protostub/123';
        let promise = sandbox.removeComponent(componentURL);

        promise.then(function(resolved) {
          expect(resolved).be.an('object');
        }).catch(function(error) {
          expect(error).be.an('string');
        });
      });

      it('should fail', function() {
        let componentURL = 'hyperty-runtime://sp1/protostub/1234';
        let promise = sandbox.removeComponent(componentURL);

        promise.then(function(resolved) {
          expect(resolved).be.an('object');
        }).catch(function(error) {
          expect(error).be.an('string');
        });
      });

    });

  });

});
