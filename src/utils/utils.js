/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/
/**
 * Support module with some functions will be useful
 * @module utils
 */

/**
 * @typedef divideURL
 * @type Object
 * @property {string} type The type of URL
 * @property {string} domain The domain of URL
 * @property {string} identity The identity of URL
 */

/**
 * Divide an url in type, domain and identity
 * @param  {URL.URL} url - url address
 * @return {divideURL} the result of divideURL
 */
export function divideURL(url) {

  function recurse(value) {
    const regex = /([a-zA-Z-]*)(:\/\/(?:\.)?|:)([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi;
    const subst = '$1,$3,$4';
    let parts = value.replace(regex, subst).split(',');
    return parts;
  }

  let parts = recurse(url);

  // If the url has no scheme
  if (parts[0] === url && !parts[0].includes('@')) {

    let result = {
      type: '',
      domain: url,
      identity: ''
    };

    console.warn('[DivideURL] DivideURL don\'t support url without scheme. Please review your url address', url);

    return result;
  }

	// check if the url has the scheme and includes an @
  if (parts[0] === url && parts[0].includes('@')) {
    let scheme = parts[0] === url ? 'smtp' : parts[0];
    parts = recurse(scheme + '://' + parts[0]);
  }

	// if the domain includes an @, divide it to domain and identity respectively
  if (parts[1].includes('@')) {
    parts[2] = parts[0] + '://' + parts[1];
    parts[1] = parts[1].substr(parts[1].indexOf('@') + 1);
  } 	/*else if (parts[2].includes('/')) {
    parts[2] = parts[2].substr(parts[2].lastIndexOf('/')+1);
  }*/

  let result = {
    type: parts[0],
    domain: parts[1],
    identity: parts[2]
  };

  return result;

}

/**
 * Check if an Object is empty
 * @param  {Object} object Object to be checked
 * @return {Boolean}       status of Object, empty or not (true|false);
 */
export function emptyObject(object) {
  return Object.keys(object).length > 0 ? false : true;
}

/**
 * Make a COPY of the original data
 * @param  {Object}  obj - object to be cloned
 * @return {Object}
 */
export function deepClone(obj) {
  //TODO: simple but inefficient JSON deep clone...
  if (obj) return JSON.parse(JSON.stringify(obj));
}

export function removePathFromURL(url) {
  let splitURL = url.split('/');
  return splitURL[0] + '//' + splitURL[2] + '/' + splitURL[3];
}

/**
 * Obtains the user URL that corresponds to a given email
 * @param  {string} userEmail The user email
 * @return {URL.URL} userURL The user URL
 */
export function getUserURLFromEmail(userEmail) {
  let indexOfAt = userEmail.indexOf('@');
  return 'user://' + userEmail.substring(indexOfAt + 1, userEmail.length) + '/' + userEmail.substring(0, indexOfAt);
}

/**
 * Obtains the user email that corresponds to a given URL
 * @param  {URL.URL} userURL The user URL
 * @return {string} userEmail The user email
 */
export function getUserEmailFromURL(userURL) {
  let url = divideURL(userURL);
  return url.identity.replace('/', '') + '@' + url.domain; // identity field has '/exampleID' instead of 'exampleID'
}

/**
 * Check if the user identifier is already in the URL format, if not, convert to URL format
 * @param  {string}   identifier  user identifier
 * @return {string}   userURL    the user URL
 */
export function convertToUserURL(identifier) {

  // check if the identifier is already in the url format
  if (identifier.substring(0, 7) === 'user://') {
    let dividedURL = divideURL(identifier);

    //check if the url is well formated
    if (dividedURL.domain && dividedURL.identity) {
      return identifier;
    } else {
      throw 'userURL with wrong format';
    }

  //if not, convert the user email to URL format
  } else {
    return getUserURLFromEmail(identifier);
  }
}

export function isDataObjectURL(url) {
  let schemasToIgnore = ['domain-idp', 'runtime', 'domain', 'hyperty'];
  let splitURL = (url).split('://');
  let urlSchema = splitURL[0];

  return schemasToIgnore.indexOf(urlSchema) === -1;
}

export function isLegacy(url) {
  if (url.split('@').length > 1) {
    return true;
  } else {
    return false;
  }
}

export function isURL(url) {
  return (url).split('/').length >= 3;
}

export function isUserURL(url) {
  return divideURL(url).type === 'user';
}

export function isHypertyURL(url) {
  return divideURL(url).type === 'hyperty';
}

/**
 * get information relative each component configured on runtime configuration;
 * @param  {object} configuration object with all configuration
 * @param  {string} component     string with the component to get the configuration, like, runtimeURLS, catalogueURLs, msgNodeURL, domainRegistryURL;
 * @param  {string} resource      type of resource to get, like, catalogue, runtimeUA, protocolstub, idpProxy
 * @return {object}               return an object with all configurations;
 */
export function getConfigurationResources(configuration, component, resource) {
  let objectResource = configuration[component];
  let resourceType = objectResource[resource];

  return resourceType;
}

/**
 * Build a full url with the runtime configuration;
 * @param  {object} configuration object with all configuration
 * @param  {string} component     string with the component to get the configuration, like, runtimeURLS, catalogueURLs, msgNodeURL, domainRegistryURL;
 * @param  {string} resource      type of resource to get, like, catalogue, runtimeUA, protocolstub, idpProxy
 * @param  {string} type          resource to get, like a hyperty name or protocolstub name;
 * @param  {boolean} useFallback  if true the function will check if have a fallback url;
 * @return {string}               partial url to contact the resource;
 */
export function buildURL(configuration, component, resource, type, useFallback = false) {
  let objectResource = configuration[component];
  let url;

  if (!objectResource.hasOwnProperty(resource)) {
    throw Error('The configuration ' + JSON.stringify(objectResource, '', 2) + ' don\'t have the ' + resource + ' resource you are looking for');
  }

  let resourceType = objectResource[resource];

  if (type) {
    url = resourceType.prefix + configuration.domain + resourceType.suffix + type;
    if (resourceType.hasOwnProperty('fallback') && useFallback) {
      if (resourceType.fallback.indexOf('%domain%')) {
        url = resourceType.fallback.replace(/(%domain%)/g, configuration.domain) + type;
      } else {
        url = resourceType.fallback + type;
      }
    }
  } else {
    url = resourceType.prefix + configuration.domain + resourceType.suffix;
  }

  // console.log(url);

  return url;
}

/**
 * Generate a Global Unique ID
 *
 * @returns String;
 */
export function generateGUID() {

  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

}

export function getUserIdentityDomain(url) {
  let dividedURL = divideURL(url);
  let splitedDomain = dividedURL.domain.split('.');
  let splitedLength = splitedDomain.length;
  if (splitedLength == 1) {
    return splitedDomain[splitedLength - 1];
  }
  let domain = splitedDomain[splitedLength - 2] + '.' + splitedDomain[splitedLength - 1];
  return domain;
}

/**
 * Check if URL is from a backend service
 * @param  {string} url     URL to be processed
 * @return {boolean}
 */

export function isBackendServiceURL(url) {
  let dividedURL = divideURL(url);
  let splitedDomain = dividedURL.domain.split('.');
  let backendSchemes = ['domain', 'global', 'domain-idp']; // should be defined in the runtime configuration
  let backendSubDomains = ['registry', 'msg-node']; // should be defined in the runtime configuration
  let subDomain;

  if (splitedDomain.length > 1) {
    subDomain = splitedDomain[0];
  }

  if (subDomain && backendSubDomains.indexOf(subDomain)) {
    return true;
  }

  if (dividedURL.type) {
    return (backendSchemes.indexOf(dividedURL.type) !== -1);
  }

  return false;
}

export function divideEmail(email) {
  let indexOfAt = email.indexOf('@');

  let result = {
    username: email.substring(0, indexOfAt),
    domain: email.substring(indexOfAt + 1, email.length)
  };

  return result;
}


export function assign(obj, keyPath, value) {

  if (!obj) obj = {};
  if (typeof(keyPath) === 'string') keyPath = parseAttributes(keyPath);

  let lastKeyIndex = keyPath.length - 1;

  for (var i = 0; i < lastKeyIndex; ++i) {
    let key = keyPath[i];
    if (!(key in obj)) {
      obj[key] = {};
    }

    obj = obj[key];

  }

  obj[keyPath[lastKeyIndex]] = value;
}

export function splitObjectURL(dataObjectURL) {
  console.info('[utils - splitObjectURL]: ', dataObjectURL);

  let splitedURL = dataObjectURL.split('/');
  let url = splitedURL[0] + '//' + splitedURL[2] + '/' + splitedURL[3];
  let resource = splitedURL[5];

  let result = {
    url: url,
    resource: resource
  };

  console.info('[utils - splitObjectURL]: ', result);

  return result;
}

export function checkAttribute(path) {

  let regex = /((([a-zA-Z]+):\/\/([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})\/[a-zA-Z0-9\.]+@[a-zA-Z0-9]+(\-)?[a-zA-Z0-9]+(\.)?[a-zA-Z0-9]{2,10}?\.[a-zA-Z]{2,10})(.+(?=.identity))?/gm;

  let list = [];
  let final = [];
  let test = path.match(regex);

  if (test == null) {
    final = path.split('.');
  } else {
    let m;
    while ((m = regex.exec(path)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        if (groupIndex === 0) {
          list.push(match);
        }
      });
    }
    let result;
    list.forEach((url) => {

      result = path.replace(url, '*-*');
      final = result.split('.').map((item) => {

        if (item === '*-*') { return url; }

        return item;
      });
    });
  }

  console.log('[RuntimeCore.Utils.checkAttribute]', final);
  return final;
}

export function parseAttributes(path) {
  let regex = /([0-9a-zA-Z][-\w]*):\/\//g;

  let string3 = 'identity';

  if (!path.includes('://')) {
    return (path.split('.'));
  } else {
    let string1 = path.split(regex)[0];

    let array1 = string1.split('.');

    let string2 = path.replace(string1, '');

    if (path.includes(string3)) {

      let array2 = string2.split(string3 + '.');

      console.log('array2 ' + array2);

      string2 = array2[0].slice('.', -1);

      array2 = array2[1].split('.');

      array1.push(string2, string3);

      array1 = array1.concat(array2);

    } else {
      array1.push(string2);

    }

    return (array1.filter(Boolean));

  }

}
