import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

import Dexie from 'dexie';

import StorageManager from '../src/storage-manager/StorageManager';
import RuntimeCapabilities from '../src/runtime-capabilities/RuntimeCapabilities';

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.config.truncateThreshold = 0;

let expect = chai.expect;

// Testing Runtime Capabilities
describe('Runtime Runtime Capabilities', () => {

  let getEnvironment;
  let getMediaDevices;
  let storageManager;
  let runtimeCapabilities;

  before(() => {

    const db = new Dexie('cache');
    const storeName = 'objects';
    storageManager = new StorageManager(db, storeName);

    runtimeCapabilities = new RuntimeCapabilities();

    sinon.stub(runtimeCapabilities, 'getRuntimeCapabilities').callsFake(() => {
      return new Promise((resolve, reject) => {

        Promise.all([getEnvironment(), getMediaDevices()]).then((result) => {
          let capabilities = {};
          result.forEach((capability) => {
            Object.assign(capabilities, capability);
          });
          storageManager.set('capabilities', '1', capabilities);
          expect(capabilities).to.contain.any.keys('browser', 'node');
          resolve(capabilities);
        }).catch((error) => {
          reject(error);
        });

      });
    });

    sinon.stub(runtimeCapabilities, 'isAvailable').callsFake((capability) => {
      return new Promise((resolve) => {

        storageManager.get('capabilities').then((capabilities) => {

          console.log('Capability ' + capability + ' is available? ', capabilities.hasOwnProperty(capability) && capabilities[capability]);
          if (capabilities.hasOwnProperty(capability) && capabilities[capability]) {
            resolve(true);
          } else {
            resolve(false);
          }
        });

      });
    });

    sinon.stub(runtimeCapabilities, 'update').callsFake(() => {
      return new Promise((resolve, reject) => {
        runtimeCapabilities.getRuntimeCapabilities().then(resolve).catch(reject);
      });
    });

    getEnvironment = () => {

      return {
        browser: !!(navigator),
        node: !(navigator)
      };
    };

    getMediaDevices = () => {
      return new Promise((resolve) => {

        let capability = {};

        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          console.log('enumerateDevices() not supported.');
          resolve(capability);
          return;
        }

        // List cameras and microphones.
        navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          devices.forEach((device) => {
            // console.log(device.kind, device.label, device.deviceId);
            if (device.kind === 'audioinput' && device.deviceId === 'default') {
              capability.mic = true;
            }

            if (device.kind === 'videoinput') {
              capability.camera = true;
            }
          });
          resolve(capability);
        })
        .catch((err) => {
          resolve(capability);
          console.log(err.name + ': ' + err.message);
        });
      });
    };

  });

  after(() => {
    runtimeCapabilities.getRuntimeCapabilities.restore();
    runtimeCapabilities.isAvailable.restore();
    runtimeCapabilities.update.restore();
  });

  it('should return a promise with RuntimeCapabilities and save on storageManager', (done) => {

    expect(runtimeCapabilities.getRuntimeCapabilities()).to.be.fulfilled
    .and.to.be.instanceof(Promise)
    .and.notify(done);

  });

  it('should return if a capability was available', (done) => {

    // let capabilities = [
    //   'browser', 'node', 'windowSandbox',
    //   'mic', 'camera', 'sensor', 'webrtc',
    //   'ortc', 'http', 'https', 'ws',
    //   'wss', 'coap', 'datachannel'];

    expect(runtimeCapabilities.isAvailable('node'))
    .to.be.fulfilled
    .and.to.be.instanceof(Promise)
    .and.to.eventually.equal(false);

    expect(runtimeCapabilities.isAvailable('sensor'))
    .to.be.fulfilled
    .and.to.be.instanceof(Promise)
    .and.to.eventually.equal(false);

    expect(runtimeCapabilities.isAvailable('browser'))
    .to.be.fulfilled
    .and.to.be.instanceof(Promise)
    .and.to.eventually.equal(true)
    .and.notify(done);

  });

  it('should update the previous capabilites', (done) => {
    expect(runtimeCapabilities.update())
    .to.be.fulfilled
    .and.notify(done);
  });

});
