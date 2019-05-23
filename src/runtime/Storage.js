import { runtimeConfiguration } from './runtimeConfiguration';

let storages = {};

export function storage(runtimeFactory, runtimeStatusUpdate) {
  if (!runtimeFactory) throw new Error('The runtime factory is a needed parameter');

  console.log('[Storage.storage] storageSchemas ', runtimeConfiguration.storageSchemas);

  Object.keys(runtimeConfiguration.storageSchemas).forEach((key) => {

    if (!storages.hasOwnProperty(key)) {
      storages[key] = runtimeFactory.storageManager(key, runtimeConfiguration.storageSchemas[key], runtimeStatusUpdate);
    }

  });

  return storages;
}

export function createSyncDB(name, runtimeFactory, url = false) {
  if (!name) throw new Error('[Runtime.Storage.createSyncDB] name is a needed parameter');
  if (!runtimeFactory) throw new Error('[Runtime.Storage.createSyncDB] The runtime factory is a needed parameter');

  let remote = url ? url : runtimeConfiguration.remoteStorage;

  return runtimeFactory.syncStorageManager( name, remote );

}
