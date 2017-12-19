import { runtimeConfiguration } from './runtimeConfiguration';

let storages = {};

export function storage(runtimeFactory) {
  if (!runtimeConfiguration) throw new Error('The runtime configuration is a needed parameter');

  console.log('Storage:', storages);

  Object.keys(runtimeConfiguration.storageSchemas).forEach((key) => {

    if (!storages.hasOwnProperty(key)) {
      console.log('Key:', key, runtimeConfiguration.storageSchemas[key]);
      storages[key] = runtimeFactory.storageManager(key, runtimeConfiguration.storageSchemas[key]);
    }

  });

  console.log(storages);

  return storages;

}
