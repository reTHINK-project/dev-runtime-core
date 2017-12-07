import { generateGUID } from '../../src/utils/utils';

export const SIZES = {
  '5KB': 1024 * 5,               // 5KB
  '50KB': 1024 * 5 * 10,          // 50KB
  '500KB': 1024 * 5 * 100,         // 500KB
  '5MB': 1024 * 1024 * 5,        // 5MB
  '50MB': 1024 * 1024 * 5 * 10,   // 50MB
  '100MB': 1024 * 1024 * 1 * 100,   // 100MB
  '500MB': 1024 * 1024 * 5 * 100   // 500MB
};

export function generateData(size = '100MB') {

  const selectedSize = SIZES[size] / 4; // chunk will be repetition of 4B
  const content = (new Array(selectedSize + 1)).join('łŧ');

  var blob = null;

  if (Blob !== undefined || BlobBuilder !== undefined) {
    // Android 4.2 Browser has "Blob" object but generates exception
    try {
      blob = new Blob([content], {type: 'text/plain'});
    } catch (e) {
      var bb = new BlobBuilder();
      bb.append(content);
      blob = bb.getBlob({type: 'text/plain'});
    }
  } else {
    blob = {
      size: selectedSize,
      payload: content
    };
  }

  // now is the generated time
  blob.lastModifiedDate = new Date();

  // Name it random so key won't conflict
  blob.name = (~~(Math.random() * 100000) + 100000) + '.txt';

  return blob;
}


let index = 0;
export function buildResourceMessage(from, runtimeURL, data, type = 'create') {

  index++;

  const p2pHandler = runtimeURL + 'p2phandler/' + generateGUID();
  const dataObjectURL = 'comm://localhost/' + generateGUID();

  let msg = {
    type: type,
    from: from,
    to: runtimeURL + '/storage',
    body: {
      auth: false,
      identity: { userProfle: {} },
      value: {
        children: 'resources',
        p2pHandler: p2pHandler,
        parent: dataObjectURL,
        runtime: runtimeURL,
        schema: 'hyperty-catalogue://catalogue.localhost/.well-known/dataschema/Communication',
        reporter: from
      }
    }
  };

  const resource = {
    content: data,
    created: data.lastModifiedDate,
    lastModified: data.lastModifiedDate,
    mimetype: data.type,
    name: data.name,
    resourceType: 'file',
    size: data.size,
    url: from + '#' + index
  };

  Object.assign(msg.body.value, resource);

  return msg;
}
