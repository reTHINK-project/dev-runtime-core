let GraphConnector;
if (process.env.MODE !== 'light') {
  let GraphConnectorBase = require('./GraphConnectorBase');
  GraphConnector = GraphConnectorBase;
} else {
  let GraphConnectorLight = require('./GraphConnectorLight');
  GraphConnector = GraphConnectorLight;
}

console.log(GraphConnector);

export default GraphConnector;
