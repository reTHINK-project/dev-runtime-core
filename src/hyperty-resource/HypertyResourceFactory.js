/**
* The Hyperty Resource Data Model is used to model resouces handled by Hyperties and Data Objects including chat messages, files, real time human audio and video..
*
*/

import FileHypertyResource from './FileHypertyResource';

class HypertyResourceFactory {

  /**
  * HypertyResourceFactory constructor
  *
  */

  constructor() {

  }

  createHypertyResource(isSender, type, metadata) {
    let newHypertyResource;

    switch (type) {
      case 'file':
        newHypertyResource = new FileHypertyResource(isSender, metadata);
        break;
      default:
        throw new Error('[HypertyResourceFactory.createHypertyResource] not supported type: ', type);
        break;
      }

      return(newHypertyResource);

  }

  createHypertyResourceWithContent(isSender, type, content, metadata) {
    let newHypertyResource;

    return new Promise((resolve) => {

    switch (type) {
      case 'file':
        newHypertyResource = new FileHypertyResource(isSender, metadata);
        break;
      default:
        reject();
        break;
      }

      newHypertyResource.init(content).then(()=>{
        return newHypertyResource.save();// skip save?
      }).then(()=>{
        resolve(newHypertyResource);
      });

  });

  }
}

export default HypertyResourceFactory;
