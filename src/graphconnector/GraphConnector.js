// let GraphConnector;
// if (process.env.MODE !== 'light') {
//   GraphConnector = require('./GraphConnectorBase');
//   if (GraphConnector && GraphConnector.hasOwnProperty('default')) GraphConnector = GraphConnector.default;
// } else {
//   GraphConnector = require('./GraphConnectorLight');
//   if (GraphConnector &&  GraphConnector.hasOwnProperty('default')) GraphConnector = GraphConnector.default;
// }

/**
 * The GraphConnectorBase have some problems with the size;
 * @deprecated Due to some problems increase a lot the file size
 */
// import GraphConnector from './GraphConnectorBase';

/**
 *
 * @experimental used instead of GraphConnectorBase;
 */
import GraphConnector from './GraphConnectorLight';

export default GraphConnector;
