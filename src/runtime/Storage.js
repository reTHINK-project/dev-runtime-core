import { runtimeConfiguration } from './runtimeConfiguration';

let storages = {};

export function storage(runtimeFactory) {
  if (!runtimeFactory) throw new Error('The runtime factory is a needed parameter');

  Object.keys(runtimeConfiguration.storageSchemas).forEach((key) => {

    if (!storages.hasOwnProperty(key)) {
      storages[key] = runtimeFactory.storageManager(key, runtimeConfiguration.storageSchemas[key]);
    }

  });

  return storages;
}

export function createSyncDB(key, runtimeFactory, schema, url = false) {
  if (!runtimeFactory) throw new Error('The runtime factory is a needed parameter');

  let remote = url ? url : runtimeConfiguration.remoteStorage;

  return runtimeFactory.storageManager(key, runtimeConfiguration.storageSchemas[schema], remote);

}
