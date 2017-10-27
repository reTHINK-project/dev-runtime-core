let GraphConnector;
if (process.env.MODE !== 'light') {
  GraphConnector = require('./GraphConnectorBase');
  console.log('GraphConnector Base:', GraphConnector.hasOwnProperty('default'));
  if (GraphConnector && GraphConnector.hasOwnProperty('default')) GraphConnector = GraphConnector.default;
} else {
  GraphConnector = require('./GraphConnectorLight');
  console.log('GraphConnector Light:', GraphConnector.hasOwnProperty('default'));
  if (GraphConnector &&  GraphConnector.hasOwnProperty('default')) GraphConnector = GraphConnector.default;
}

export default GraphConnector;
