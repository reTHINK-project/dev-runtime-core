import { runtimeConfiguration } from './runtimeConfiguration';

let storages = {};

export function storage(runtimeFactory, runtimeStatusUpdate) {
  if (!runtimeFactory) throw new Error('The runtime factory is a needed parameter');

  Object.keys(runtimeConfiguration.storageSchemas).forEach((key) => {

    if (!storages.hasOwnProperty(key)) {
      storages[key] = runtimeFactory.storageManager(key, runtimeConfiguration.storageSchemas[key], runtimeStatusUpdate);
    }

  });

  return storages;
}

export function createSyncDB(key, runtimeFactory, schema, runtimeStatusUpdate, url = false) {
  if (!runtimeFactory) throw new Error('The runtime factory is a needed parameter');

  let remote = url ? url : runtimeConfiguration.remoteStorage;

  return runtimeFactory.storageManager(key, schema, runtimeStatusUpdate, remote);

}
