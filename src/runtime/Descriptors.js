import {divideURL} from '../utils/utils';

class Descriptors {

  constructor(runtimeURL, catalogue) {
    if (!runtimeURL) throw Error('The descriptor know the runtime url to be used');
    if (!catalogue) throw Error('The descriptor needs the catalogue instance');

    this.runtimeURL = runtimeURL;
    this.catalogue = catalogue;
  }

  getHypertyDescriptor (hypertyURL) {
    console.log('Type of: ', typeof this.catalogue.getHypertyDescriptor);
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

    // let prefix = 'catalogue.';
    // if (stubURL.includes('catalogue')) {
    //   prefix = '';
    // }

    stubURL = type + '://' + domain + '/.well-known/protocolstub/' + protostub;

    console.log('Type of: ', typeof this.catalogue.getStubDescriptor);
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

      // let prefix = 'catalogue.';
      // if (idpProxyURL.includes('catalogue')) {
      //   prefix = '';
      // }

      idpProxyURL = type + '://' + domain + '/.well-known/idp-proxy/' + idpproxy;

      console.log('Load IDPProxy: ', idpProxyURL);

      return this.catalogue.getIdpProxyDescriptor(idpProxyURL).then((result) => {

        // console.log('result: ', result);
        resolve(result);

      }).catch(() => {

        idpproxy = domain;
        domain = originDomain;

        // console.log('Get an specific protostub for domain', domain, ' specific for: ', idpproxy);
        idpProxyURL = type + '://' + domain + '/.well-known/idp-proxy/' + idpproxy;

        console.log('Load IDPProxy: ', idpProxyURL);
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
