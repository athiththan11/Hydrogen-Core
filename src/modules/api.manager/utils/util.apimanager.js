'use strict';

const { logger } = require('../../../utils/util.winston');
const { ports } = require('../../../maps/map.hydrogen');

/**
 * method to construct gateway environment configurations
 *
 * @param {*} Element Element libxmljs.Element instance
 * @param {*} xmlDoc parsed libxmljs Document
 * @param {*} args environment parameters and connection strings
 * @returns constructed envrionment element
 */
function constructGatewayEnvironment(Element, xmlDoc, args) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Constructing Gateway Environment');

	let environmentElem = new Element(xmlDoc, 'Environment').attributes({
		type: args.type,
		'api-console': args['api-console'],
	});
	environmentElem
		.node('Name', args._name)
		.parent()
		.node('Description', args._description)
		.parent()
		.node('ServerURL', 'https://' + args._hostname + ':' + (ports._9443 + args.offset) + '/services/')
		.parent()
		.node('Username', 'admin')
		.parent()
		.node('Password', 'admin')
		.parent()
		.node(
			'GatewayEndpoint',
			'http://' +
				args._hostname +
				':' +
				(ports._8280 + args.offset) +
				',' +
				'https://' +
				args._hostname +
				':' +
				(ports._8243 + args.offset)
		);
	return environmentElem;
}

exports.constructGatewayEnvironment = constructGatewayEnvironment;
