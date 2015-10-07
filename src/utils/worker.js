
function intialize(event) {

  var data = event.data;

  console.log(data);

  postMessage('holla!!!');

}

self.addEventListener('message', intialize);
