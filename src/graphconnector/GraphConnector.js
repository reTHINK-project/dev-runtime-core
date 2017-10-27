let GraphConnector;
if (process.env.MODE !== 'light') {
  GraphConnector = require('./GraphConnectorBase');
  if (GraphConnector && GraphConnector.hasOwnProperty('default')) GraphConnector = GraphConnector.default;
} else {
  GraphConnector = require('./GraphConnectorLight');
  if (GraphConnector &&  GraphConnector.hasOwnProperty('default')) GraphConnector = GraphConnector.default;
}

export default GraphConnector;
