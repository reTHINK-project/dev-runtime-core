import { descriptors } from './descriptors.js';

import { divideURL } from '../../src/utils/utils';

export const getDescriptor = function (url) {

  return new Promise(function(resolve, reject) {

    let dividedURL = divideURL(url);
    let identity = dividedURL.identity;

    console.log(url, dividedURL.domain, url === dividedURL.domain);

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
      if (url.includes(identity)) {
        identity = 'default';
      }

      let def = descriptors.ProtoStubs[identity];
      try {

        let sc = atob(def.sourcePackage.sourceCode);

        def.sourcePackage.sourceCode = sc;

        result = def;

      } catch (e) {
        result = def;
      }
    } else if (url.includes('idp-proxy')) {
      let def = descriptors.IdpProxies[identity];

      try {

        let sc = atob(def.sourcePackage.sourceCode);

        def.sourcePackage.sourceCode = sc;

        result = def;
      } catch (e) {
        result = def;
      }
    } else if (url.includes('dataschema')) {
      try {
        result = descriptors.DataSchemas[identity];
      } catch (e) {
        return reject(e);
      }

    }

    console.log('RESULT:', result);

    resolve(result);

  });
};
