export const SELECTION = {
  '5KB': 1024 * 5,               // 5KB
  '50KB': 1024 * 5 * 10,          // 50KB
  '500KB': 1024 * 5 * 100,         // 500KB
  '5MB': 1024 * 1024 * 5,        // 5MB
  '50MB': 1024 * 1024 * 5 * 10,   // 50MB
  '500MB': 1024 * 1024 * 5 * 100   // 500MB
};

export function generateData(size = '50MB') {
  const selectedSize = SELECTION[size] / 4; // chunk will be repetition of 4B
  const content = (new Array(selectedSize + 1)).join('aあ');

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
