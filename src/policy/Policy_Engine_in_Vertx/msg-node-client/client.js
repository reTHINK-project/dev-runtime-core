var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:9090/ws');

var message = {
  header: {
    id: 12,
    from: 'Bob',
    to: 'Alice',
    type: 'chat'
  },

  body: {
    code: '200',
    desc: 'Send me money!'
  }

};

ws.on('open', function() {
  ws.send(JSON.stringify(message));
});
