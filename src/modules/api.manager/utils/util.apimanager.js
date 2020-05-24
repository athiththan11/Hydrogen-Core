'use strict';

const { logger } = require('../../../utils/util.winston');
const { ports } = require('../../../maps/map.hydrogen');

/**
 * method to construct gateway environment configurations
 *
 * @param {Element} Element Element libxmljs.Element instance
 * @param {Document} xmlDoc parsed libxmljs Document
 * @param {{}} args environment parameters and connection strings
 * @returns {Element} constructed envrionment element
 */
function constructGatewayEnvironment(Element, xmlDoc, args) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Constructing Gateway Environment');

	let environmentElem = new Element(xmlDoc, 'Environment').attr({
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
		.node('Username', args.username ? args.username : 'admin')
		.parent()
		.node('Password', args.password ? args.password : 'admin')
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

/**
 * method to construct gateway environment configurations for toml
 *
 * @param {{}} args environment parameters and connection strings
 * @returns {{}} constructed envrionment element
 */
function constructGatewayEnvironmentToml(args) {
	let obj = {
		name: args._name,
		type: args.type,
		display_in_api_console: args['api-console'],
		description: args._description,
		show_as_token_endpoint_url: true,
		service_url: 'https://' + args._hostname + ':' + (ports._9443 + args.offset) + '/services/',
		username: args.username ? args.username : '${admin.username}',
		password: args.password ? args.password : '${admin.password}',
		ws_endpoint: 'ws://' + args._hostname + ':' + (ports._9099 + args.offset),
		wss_endpoint: 'wss://' + args._hostname + ':' + (ports._8099 + args.offset),
		http_endpoint: 'http://' + args._hostname + ':' + (ports._8280 + args.offset),
		https_endpoint: 'https://' + args._hostname + ':' + (ports._8243 + args.offset),
	};
	return obj;
}

exports.constructGatewayEnvironment = constructGatewayEnvironment;
exports.constructGatewayEnvironmentToml = constructGatewayEnvironmentToml;
