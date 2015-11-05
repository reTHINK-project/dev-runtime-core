import chai from 'chai';
var expect = chai.expect;

// testing dependecie
import request from '../src/utils/request';

import Registry from '../src/registry/Registry';
import MessageBus from '../src/bus/MessageBus';

describe('Sandbox Interface', function() {
  // Only for testing
  let runtimeURL = 'hyperty-runtime://sp1/protostub/123';

  let messageBus = new MessageBus(registry);
  let registry = new Registry(messageBus, runtimeURL);

  let componentSourceCode;

  before(function() {
    return request.get('dist/VertxProtoStub.js').then(function(result) {
      componentSourceCode = result;
      return result;
    }).catch(function(error) {
      componentSourceCode = error;
    });
  });

  describe('constructor()', function() {

  });

  describe('deployComponent()', function() {

  });

  // TODO: develop removeComponent
  describe('removeComponent()', function() {

  });

});
