import {divideURL, getPrefix} from '../utils/utils';

class Descriptors {

  constructor(runtimeURL, catalogue, runtimeConfiguration) {
    if (!runtimeURL) throw Error('The descriptor know the runtime url to be used');
    if (!catalogue) throw Error('The descriptor needs the catalogue instance');
    if (!runtimeConfiguration) throw Error('The descriptor needs the runtime configuration');

    this.runtimeConfiguration = runtimeConfiguration;
    this.runtimeURL = runtimeURL;
    this.catalogue = catalogue;
  }

  getHypertyDescriptor (hypertyURL) {
    let dividedURL = divideURL(hypertyURL);
    let type = dividedURL.type;
    let domain = dividedURL.domain;
    let hyperty = dividedURL.identity;

    let prefix = getPrefix(this.runtimeConfiguration, 'cataloguePrefix');

    console.log(type, domain, hyperty);

    hypertyURL = type + '://' + prefix + domain + hyperty;

    return this.catalogue.getHypertyDescriptor(hypertyURL);
  }

  getStubDescriptor (stubURL) {
    let dividedURL = divideURL(stubURL);
    let type = dividedURL.type;
    let domain = dividedURL.domain;
    let protostub = dividedURL.identity;

    if (!protostub) {
      protostub = 'default';
    } else {
      protostub = protostub.substring(protostub.lastIndexOf('/') + 1);
    }

    let prefix = getPrefix(this.runtimeConfiguration, 'cataloguePrefix');

    stubURL = type + '://' + prefix + domain + '/.well-known/protocolstub/' + protostub;

    return this.catalogue.getStubDescriptor(stubURL);
  }

  getIdpProxyDescriptor(idpProxyURL) {
    console.log('IDP ProxyURL: ', idpProxyURL);

    return new Promise((resolve, reject) => {

      let dividedURL = divideURL(idpProxyURL);
      let type = dividedURL.type;
      let domain = dividedURL.domain;
      let idpproxy = dividedURL.identity;

      let originDividedURL = divideURL(this.runtimeURL);
      let originDomain = originDividedURL.domain;

      if (!domain) {
        domain = idpProxyURL;
      }

      if (domain === originDomain || !idpproxy) {
        idpproxy = 'default';
      } else {
        idpproxy = idpproxy.substring(idpproxy.lastIndexOf('/') + 1);
      }

      let prefix = getPrefix(this.runtimeConfiguration, 'cataloguePrefix');

      idpProxyURL = type + '://' + prefix + domain + '/.well-known/idp-proxy/' + idpproxy;

      return this.catalogue.getIdpProxyDescriptor(idpProxyURL).then((result) => {

        // console.log('result: ', result);
        resolve(result);

      }).catch(() => {

        idpproxy = domain;
        domain = originDomain;

        // console.log('Get an specific protostub for domain', domain, ' specific for: ', idpproxy);
        idpProxyURL = type + '://' + prefix + domain + '/.well-known/idp-proxy/' + idpproxy;

        return this.catalogue.getIdpProxyDescriptor(idpProxyURL);
      }).then((result) => {
        resolve(result);
      }).catch((reason) => {
        reject(reason);
      });

    });
  }
}

export default Descriptors;
