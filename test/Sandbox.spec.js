import SandboxRegistry from '../src/sandbox/SandboxRegistry';
import Sandbox from '../src/sandbox/Sandbox';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

let expect = chai.expect;
chai.use(chaiAsPromised);

describe('Sandbox', function() {
  it('deploy and undeploy', function(done) {
    let deploySend;

    let sb = new Sandbox();
    sb._onPostMessage = (msg) => {
      console.log(msg);
      if (msg.id === 1) {
        expect(msg).to.eql({
          id: 1, type: 'create', from: 'sandbox://external', to: 'sandbox://internal',
          body: { url: 'hyperty://fake-url', sourceCode: '<source code>', config: {init: '<init>'} }
        });
      }

      if (msg.id  === 2) {
        expect(msg).to.eql({
          id: 2, type: 'delete', from: 'sandbox://external', to: 'sandbox://internal',
          body: { url: 'hyperty://fake-url' }
        });
      }

      deploySend(msg);
    };

    let bus = {
      addListener: (url, callback) => {
        expect(url).to.eql('sandbox://internal');
        deploySend = callback;
      },

      postMessage: (msg) => {
        expect(msg).to.eql({
          id: msg.id, type: 'response', from: 'sandbox://internal', to: 'sandbox://external',
          body: { code: 200 }
        });

        sb._onMessage(msg);
      },

      removeAllListenersOf: (url) => {
        expect(url).to.eql('hyperty://fake-url');
      }
    };

    let sbr = new SandboxRegistry(bus);
    sbr._create = (url, sourceCode, config) => {
      expect(url).to.eql('hyperty://fake-url');
      expect(sourceCode).to.eql('<source code>');
      expect(config).to.eql({init: '<init>'});
      return '<instance>';
    };

    expect(sb.deployComponent('<source code>', 'hyperty://fake-url', {init: '<init>'}).then((deployReply) => {
      expect(deployReply).to.eql('deployed');
      expect(sbr.components).to.eql({'hyperty://fake-url': '<instance>'});

      return sb.removeComponent('hyperty://fake-url').then((unDeployReply) => {
        expect(unDeployReply).to.eql('undeployed');
        expect(sbr.components).to.eql({});
      });
    })).notify(done);
  });

  it('deploy url duplication rejected', function(done) {
    let deploySend;

    let sb = new Sandbox();
    sb._onPostMessage = (msg) => { deploySend(msg); };

    let bus = {
      addListener: (url, callback) => {
        deploySend = callback;
      },

      postMessage: (msg) => {
        sb._onMessage(msg);
      }
    };

    let sbr = new SandboxRegistry(bus);
    sbr._create = (url, sourceCode, config) => {
      return '<instance>';
    };

    expect(sb.deployComponent('<source code>', 'hyperty://fake-url', {init: '<init>'}).then((deployReply) => {
      expect(deployReply).to.eql('deployed');
      expect(sbr.components).to.eql({'hyperty://fake-url': '<instance>'});
      return expect(sb.deployComponent('<source code>', 'hyperty://fake-url', {init: '<init>'})).to.be.rejectedWith('Instance hyperty://fake-url already exist!');
    })).notify(done);
  });
});
