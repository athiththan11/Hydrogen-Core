'use strict';

const __path = require('path');
const fs = require('fs');
const XMLJS = require('libxmljs');
const Toml = require('@iarna/toml');
const _ = require('lodash');
const Dot = require('dot-object');

const constants = require('../../utils/constants');
const HydrogenConfigMaps = require('../../maps/map.hydrogen');
const { logger } = require('../../utils/util.winston');
const { parseXML, parseToml, addHydrogeneratedElem, removeDeclaration } = require('../../utils/util.parser');
const { constructGatewayEnvironment, constructGatewayEnvironmentToml } = require('./utils/util.apimanager');

/**
 * method to alter server of auth manager in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} workingDir path of the current working directory
 * @param {number} [offset=0] offset value
 * @param {{ version: string }} options configuration parameters and arguments to identify versions
 */
async function alterAuthManagerServerURL(args, workingDir = process.cwd(), offset = 0, options = { version: '2.6' }) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter Server URL of AuthManager');

	try {
		// apim 2.6 block
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v26)
			await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
				let doc = new XMLJS.Document(parsed);
				let serverUrlElem = new XMLJS.Element(
					doc,
					'ServerURL',
					args._hostname + ':' + (HydrogenConfigMaps.ports._9443 + offset) + '/services/'
				);

				let defaultElem = parsed.root().get(HydrogenConfigMaps.xmlPaths.apimanager.authmanager_serverurl);
				let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.authmanager_serverurl)
					.addNextSibling(serverUrlElem);
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.authmanager_serverurl)
					.addPrevSibling(commentElem);
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.authmanager_serverurl + '[1]')
					.remove();
				let altered = removeDeclaration(parsed.toString());
				let authManagerElem = altered.substring(
					altered.indexOf('<AuthManager>'),
					altered.indexOf('</AuthManager>')
				);

				let alteredElem = addHydrogeneratedElem(authManagerElem, '<ServerURL>', 'server url changed');
				let _altered =
					altered.substring(0, altered.indexOf('<AuthManager>')) +
					alteredElem +
					altered.substring(altered.indexOf('</AuthManager>'));

				fs.writeFileSync(
					__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
					_altered,
					constants.utf8
				);
			});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter server url of api-key-validator in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 * @param {number} [offset=0] offset value
 * @param {{ version: string }} options configuration parameters and arguments to identify versions
 */
async function alterAPIKeyValidatorServerURL(
	args,
	workingDir = process.cwd(),
	offset = 0,
	options = { version: '2.6' }
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter Server URL of APIKeyValidator');

	try {
		// apim 2.6 block
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v26)
			await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
				let doc = new XMLJS.Document(parsed);
				let serverUrlElem = new XMLJS.Element(
					doc,
					'ServerURL',
					args._hostname + ':' + (HydrogenConfigMaps.ports._9443 + offset) + '/services/'
				);

				let defaultElem = parsed.root().get(HydrogenConfigMaps.xmlPaths.apimanager.apikeyvalidator_serverurl);
				let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.apikeyvalidator_serverurl)
					.addNextSibling(serverUrlElem);
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.apikeyvalidator_serverurl)
					.addPrevSibling(commentElem);
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.apikeyvalidator_serverurl + '[1]')
					.remove();
				let altered = removeDeclaration(parsed.toString());
				let apiKeyValidatorElem = altered.substring(
					altered.indexOf('<APIKeyValidator>'),
					altered.indexOf('</APIKeyValidator>')
				);

				let alteredElem = addHydrogeneratedElem(apiKeyValidatorElem, '<ServerURL>', 'server url changed');
				let _altered =
					altered.substring(0, altered.indexOf('<APIKeyValidator>')) +
					alteredElem +
					altered.substring(altered.indexOf('</APIKeyValidator>'));

				fs.writeFileSync(
					__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
					_altered,
					constants.utf8
				);
			});

		// apim 3.x block
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v31)
			await parseToml(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.deploymentToml)).then(
				(toml) => {
					let obj = {};
					Dot.str(
						HydrogenConfigMaps.tomlPaths.apimanager.apikeyvalidator_serverurl,
						args._hostname + ':' + (HydrogenConfigMaps.ports._9443 + offset) + '/services/',
						obj
					);

					let altered = _.merge(toml, obj);
					fs.writeFileSync(
						__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.deploymentToml),
						Toml.stringify(altered),
						constants.utf8
					);
				}
			);
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter revoke api url of oauth-configurations in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 * @param {number} [offset=0] offset value
 * @param {{ version: string }} options configuration parameters and arguments to identify versions
 */
async function alterOAuthConfigurationRevokeAPIURL(
	args,
	workingDir = process.cwd(),
	offset = 0,
	options = { version: '2.6' }
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter Revoke API URL of OAuthConfigurations');

	try {
		// apim 2.6 block
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v26)
			await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
				let doc = new XMLJS.Document(parsed);
				let revokeAPIUrlElem = new XMLJS.Element(
					doc,
					'RevokeAPIURL',
					args._hostname + ':' + (HydrogenConfigMaps.ports._8243 + offset) + '/revoke'
				);

				let defaultElem = parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.oauthconfigurations_revokeapiurl);
				let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.oauthconfigurations_revokeapiurl)
					.addNextSibling(revokeAPIUrlElem);
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.oauthconfigurations_revokeapiurl)
					.addPrevSibling(commentElem);
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.oauthconfigurations_revokeapiurl + '[1]')
					.remove();
				let altered = removeDeclaration(parsed.toString());
				let oauthConfigurationsElem = altered.substring(
					altered.indexOf('<OAuthConfigurations>'),
					altered.indexOf('</OAuthConfigurations>')
				);

				let alteredElem = addHydrogeneratedElem(
					oauthConfigurationsElem,
					'<RevokeAPIURL>',
					'revoke api url changed'
				);
				let _altered =
					altered.substring(0, altered.indexOf('<OAuthConfigurations>')) +
					alteredElem +
					altered.substring(altered.indexOf('</OAuthConfigurations>'));

				fs.writeFileSync(
					__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
					_altered,
					constants.utf8
				);
			});

		// apim 3.x block
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v31)
			await parseToml(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.deploymentToml)).then(
				(toml) => {
					let obj = {};
					Dot.str(
						HydrogenConfigMaps.tomlPaths.apimanager.oauthconfigurations_revokeapiurl,
						args._hostname + ':' + (HydrogenConfigMaps.ports._8243 + offset) + '/revoke',
						obj
					);

					let altered = _.merge(toml, obj);
					fs.writeFileSync(
						__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.deploymentToml),
						Toml.stringify(altered),
						constants.utf8
					);
				}
			);
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter key-validator-client-type of api-keyvalidator in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 * @param {{ version: string }} options configuration parameters and arguments to identify versions
 */
async function alterAPIKeyValidatorKeyValidatorClientType(
	args,
	workingDir = process.cwd(),
	options = { version: '2.6' }
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter Key Validator Client Type of APIKeyValidator');

	try {
		// apim 2.6 block
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v26)
			await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
				let doc = new XMLJS.Document(parsed);
				let clientTypeElem = new XMLJS.Element(doc, 'KeyValidatorClientType', args.keyValidatorClientType);

				let defaultElem = parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.apikeyvalidator_keyvalidatorclienttype);
				let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.apikeyvalidator_keyvalidatorclienttype)
					.addNextSibling(clientTypeElem);
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.apikeyvalidator_keyvalidatorclienttype)
					.addPrevSibling(commentElem);
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.apikeyvalidator_keyvalidatorclienttype + '[1]')
					.remove();
				let altered = removeDeclaration(parsed.toString());
				let apiKeyValidatorElem = altered.substring(
					altered.indexOf('<APIKeyValidator>'),
					altered.indexOf('</APIKeyValidator>')
				);

				let alteredElem = addHydrogeneratedElem(
					apiKeyValidatorElem,
					'<KeyValidatorClientType>',
					'client changed'
				);
				let _altered =
					altered.substring(0, altered.indexOf('<APIKeyValidator>')) +
					alteredElem +
					altered.substring(altered.indexOf('</APIKeyValidator>'));

				fs.writeFileSync(
					__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
					_altered,
					constants.utf8
				);
			});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter enable-thrift-server of api-key-validator in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 * @param {{ version: string }} options configuration parameters and arguments to identify versions
 */
async function alterAPIKeyValidatorEnableThriftServer(args, workingDir = process.cwd(), options = { version: '2.6' }) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter EnableThriftServer of APIKeyValidator');

	try {
		// apim 2.6 block
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v26)
			await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
				let doc = new XMLJS.Document(parsed);
				let enableElem = new XMLJS.Element(doc, 'EnableThriftServer', args.enableThriftServer);

				let defaultElem = parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.apikeyvalidator_enablethriftserver);
				let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.apikeyvalidator_enablethriftserver)
					.addNextSibling(enableElem);
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.apikeyvalidator_enablethriftserver)
					.addPrevSibling(commentElem);
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.apikeyvalidator_enablethriftserver + '[1]')
					.remove();
				let altered = removeDeclaration(parsed.toString());
				let authManagerElem = altered.substring(
					altered.indexOf('<APIKeyValidator>'),
					altered.indexOf('</APIKeyValidator>')
				);

				let alteredElem = addHydrogeneratedElem(
					authManagerElem,
					'<EnableThriftServer>',
					'thrift server changed'
				);
				let _altered =
					altered.substring(0, altered.indexOf('<APIKeyValidator>')) +
					alteredElem +
					altered.substring(altered.indexOf('</APIKeyValidator>'));

				fs.writeFileSync(
					__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
					_altered,
					constants.utf8
				);
			});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter thrift-client-port of api-key-validator in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 */
async function alterAPIKeyValidatorThriftClientPort(args, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter Thrift Client Port of APIKeyValidator');

	try {
		await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let thriftClientPortElem = new XMLJS.Element(doc, 'ThriftClientPort', args.thriftClientPort);

			// FIXME: as default thrift-client-port is commented
			// let defaultElem = parsed.root().get(HydrogenConfigMaps.xmlPaths.apimanager.apikeyvalidator_thriftclientconnectiontimeout);
			// let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.apikeyvalidator_thriftclientconnectiontimeout)
				.addNextSibling(thriftClientPortElem);
			// parsed
			// 	.root()
			// 	.get(HydrogenConfigMaps.xmlPaths.apimanager.apikeyvalidator_thriftclientconnectiontimeout)
			// 	.addPrevSibling(commentElem);
			// parsed
			// 	.root()
			// 	.get(HydrogenConfigMaps.xmlPaths.apimanager.apikeyvalidator_thriftclientconnectiontimeout + '[1]')
			// 	.remove();
			let altered = removeDeclaration(parsed.toString());
			let authManagerElem = altered.substring(
				altered.indexOf('<APIKeyValidator>'),
				altered.indexOf('</APIKeyValidator>')
			);

			let alteredElem = addHydrogeneratedElem(authManagerElem, '<ThriftClientPort>', 'port changed');
			let _altered =
				altered.substring(0, altered.indexOf('<APIKeyValidator>')) +
				alteredElem +
				altered.substring(altered.indexOf('</APIKeyValidator>'));

			fs.writeFileSync(
				__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
				_altered,
				constants.utf8
			);
		});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter server url of api-gateway environment in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 * @param {number} [offset=0] offset value
 * @param {{ version: string }} options configuration parameters and arguments to identify versions
 */
async function alterGatewayEnvironmentServerURL(
	args,
	workingDir = process.cwd(),
	offset = 0,
	options = { version: '2.6' }
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter Server URL of Gateway Environment');

	try {
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v26)
			await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
				let doc = new XMLJS.Document(parsed);
				let serverUrlElem = new XMLJS.Element(
					doc,
					'ServerURL',
					args._hostname + ':' + (HydrogenConfigMaps.ports._9443 + offset) + '/services/'
				);

				let defaultElem = parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.apigateway_environments_environment_serverurl);
				let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.apigateway_environments_environment_serverurl)
					.addNextSibling(serverUrlElem);
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.apigateway_environments_environment_serverurl)
					.addPrevSibling(commentElem);
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.apigateway_environments_environment_serverurl + '[1]')
					.remove();
				let altered = removeDeclaration(parsed.toString());
				let apiGatewayElem = altered.substring(
					altered.indexOf('<APIGateway>'),
					altered.indexOf('</APIGateway>')
				);

				let alteredElem = addHydrogeneratedElem(apiGatewayElem, '<ServerURL>', 'server url changed');
				let _altered =
					altered.substring(0, altered.indexOf('<APIGateway>')) +
					alteredElem +
					altered.substring(altered.indexOf('</APIGateway>'));

				fs.writeFileSync(
					__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
					_altered,
					constants.utf8
				);
			});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to add new gateway environment in api-manager.xml
 *
 * @param {{}} environmentConfs gateway environment configuration parameters
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 * @param {{ version: string, 'publish-multiple-gateway': boolean }} options configuration parameters and arguments to identify versions
 */
async function addGatewayEnvironment(
	environmentConfs,
	workingDir = process.cwd(),
	options = { version: '2.6', 'publish-multiple-gateway': false }
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to construct and add new Gateway Environment');

	try {
		// apim 2.6 block
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v26)
			await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
				let doc = new XMLJS.Document(parsed);
				let environmentElem = constructGatewayEnvironment(XMLJS.Element, doc, environmentConfs);

				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.apigateway_environments)
					.addChild(environmentElem);
				let altered = removeDeclaration(parsed.toString());
				let enviornmentsElem = altered.substring(
					altered.indexOf('<Environments>'),
					altered.indexOf('</Environments>')
				);

				let alteredElem = addHydrogeneratedElem(enviornmentsElem, '<Environment ', 'environment added');
				let _altered =
					altered.substring(0, altered.indexOf('<Environments>')) +
					alteredElem +
					altered.substring(altered.indexOf('</Environments>'));

				fs.writeFileSync(
					__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
					_altered,
					constants.utf8
				);
			});

		// apim 3.x block
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v31)
			await parseToml(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.deploymentToml)).then(
				(toml) => {
					let obj = {};
					let altered;
					if (options['publish-multiple-gateway']) {
						toml['apim']['gateway']['environment'].push(constructGatewayEnvironmentToml(environmentConfs));
						altered = toml;
					} else {
						_.unset(toml, HydrogenConfigMaps.tomlPaths.apimanager.apigateway_environments_environment);
						Dot.str(
							HydrogenConfigMaps.tomlPaths.apimanager.apigateway_environments_environment,
							constructGatewayEnvironmentToml(environmentConfs),
							obj
						);
						altered = _.merge(toml, obj);
					}

					fs.writeFileSync(
						__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.deploymentToml),
						Toml.stringify(altered),
						constants.utf8
					);
				}
			);
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter gateway endpoint of api-gateway environment in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 * @param {number} [offset=0] offset value
 */
async function alterGatewayEnvironmentGatewayEndpoint(args, workingDir = process.cwd(), offset = 0) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter Gateway Endpoint of Gateway Environment');

	try {
		await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let gatewayEndpointElem = new XMLJS.Element(
				doc,
				'GatewayEndpoint',
				args._hostname +
					':' +
					(HydrogenConfigMaps.ports._8280 + offset) +
					',' +
					args._hostname +
					':' +
					(HydrogenConfigMaps.ports._8243 + offset)
			);

			let defaultElem = parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.apigateway_environments_environment_gatewayendpoint);
			let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.apigateway_environments_environment_gatewayendpoint)
				.addNextSibling(gatewayEndpointElem);
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.apigateway_environments_environment_gatewayendpoint)
				.addPrevSibling(commentElem);
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.apigateway_environments_environment_gatewayendpoint + '[1]')
				.remove();
			let altered = removeDeclaration(parsed.toString());
			let apiGatewayElem = altered.substring(altered.indexOf('<APIGateway>'), altered.indexOf('</APIGateway>'));

			let alteredElem = addHydrogeneratedElem(apiGatewayElem, '<GatewayEndpoint>', 'gateway endpoint changed');
			let _altered =
				altered.substring(0, altered.indexOf('<APIGateway>')) +
				alteredElem +
				altered.substring(altered.indexOf('</APIGateway>'));

			fs.writeFileSync(
				__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
				_altered,
				constants.utf8
			);
		});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter data publisher enabled in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 */
async function alterDataPublisherEnabled(args, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG)
		logger.debug('Starting to alter Enabled of DataPublisher under Throttling Configurations');

	try {
		await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let enableElem = new XMLJS.Element(doc, 'Enabled', args.enableDataPublisher);

			let defaultElem = parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_datapublisher_enabled);
			let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_datapublisher_enabled)
				.addNextSibling(enableElem);
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_datapublisher_enabled)
				.addPrevSibling(commentElem);
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_datapublisher_enabled + '[1]')
				.remove();
			let altered = removeDeclaration(parsed.toString());
			let authManagerElem = altered.substring(
				altered.indexOf('<DataPublisher>'),
				altered.indexOf('</DataPublisher>')
			);

			let alteredElem = addHydrogeneratedElem(authManagerElem, '<Enabled>', 'changed');
			let _altered =
				altered.substring(0, altered.indexOf('<DataPublisher>')) +
				alteredElem +
				altered.substring(altered.indexOf('</DataPublisher>'));

			fs.writeFileSync(
				__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
				_altered,
				constants.utf8
			);
		});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter policy deployer enabled in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 * @param {{ version: string }} options configuration parameters and arguments to identify versions
 */
async function alterPolicyDeployerEnabled(args, workingDir = process.cwd(), options = { version: '2.6' }) {
	if (process.env.HYDROGEN_DEBUG)
		logger.debug('Starting to alter Enabled of PolicyDeployer under Throttling Configurations');

	try {
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v26)
			await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
				let doc = new XMLJS.Document(parsed);
				let enableElem = new XMLJS.Element(doc, 'Enabled', args.enablePolicyDeployer);

				let defaultElem = parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_policydeployer_enabled);
				let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_policydeployer_enabled)
					.addNextSibling(enableElem);
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_policydeployer_enabled)
					.addPrevSibling(commentElem);
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_policydeployer_enabled + '[1]')
					.remove();
				let altered = removeDeclaration(parsed.toString());
				let authManagerElem = altered.substring(
					altered.indexOf('<PolicyDeployer>'),
					altered.indexOf('</PolicyDeployer>')
				);

				let alteredElem = addHydrogeneratedElem(authManagerElem, '<Enabled>', 'changed');
				let _altered =
					altered.substring(0, altered.indexOf('<PolicyDeployer>')) +
					alteredElem +
					altered.substring(altered.indexOf('</PolicyDeployer>'));

				fs.writeFileSync(
					__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
					_altered,
					constants.utf8
				);
			});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter block condition enabled in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 */
async function alterBlockConditionEnabled(args, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG)
		logger.debug('Starting to alter Enabled of BlockCondition under Throttling Configurations');

	try {
		await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let enableElem = new XMLJS.Element(doc, 'Enabled', args.enableBlockCondition);

			let defaultElem = parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_blockcondition_enabled);
			let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_blockcondition_enabled)
				.addNextSibling(enableElem);
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_blockcondition_enabled)
				.addPrevSibling(commentElem);
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_blockcondition_enabled + '[1]')
				.remove();
			let altered = removeDeclaration(parsed.toString());
			let authManagerElem = altered.substring(
				altered.indexOf('<BlockCondition>'),
				altered.indexOf('</BlockCondition>')
			);

			let alteredElem = addHydrogeneratedElem(authManagerElem, '<Enabled>', 'changed');
			let _altered =
				altered.substring(0, altered.indexOf('<BlockCondition>')) +
				alteredElem +
				altered.substring(altered.indexOf('</BlockCondition>'));

			fs.writeFileSync(
				__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
				_altered,
				constants.utf8
			);
		});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter jms connection details enabled in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 */
async function alterJMSConnectionDetailsEnabled(args, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG)
		logger.debug('Starting to alter Enabled of JMSConnectionDetails under Throttling Configurations');

	try {
		await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let enableElem = new XMLJS.Element(doc, 'Enabled', args.enableJMSConnectionDetails);

			let defaultElem = parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_jmsconnectiondetails_enabled);
			let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_jmsconnectiondetails_enabled)
				.addNextSibling(enableElem);
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_jmsconnectiondetails_enabled)
				.addPrevSibling(commentElem);
			parsed
				.root()
				.get(
					HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_jmsconnectiondetails_enabled + '[1]'
				)
				.remove();
			let altered = removeDeclaration(parsed.toString());
			let authManagerElem = altered.substring(
				altered.indexOf('<JMSConnectionDetails>'),
				altered.indexOf('</JMSConnectionDetails>')
			);

			let alteredElem = addHydrogeneratedElem(authManagerElem, '<Enabled>', 'changed');
			let _altered =
				altered.substring(0, altered.indexOf('<JMSConnectionDetails>')) +
				alteredElem +
				altered.substring(altered.indexOf('</JMSConnectionDetails>'));

			fs.writeFileSync(
				__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
				_altered,
				constants.utf8
			);
		});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter display url of api store in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 */
async function alterAPIStoreDisplayURL(args, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter DisplayURL of APIStore');

	try {
		await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let displayURLElem = new XMLJS.Element(doc, 'DisplayURL', args.displayURL);

			let defaultElem = parsed.root().get(HydrogenConfigMaps.xmlPaths.apimanager.apistore_displayurl);
			let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.apistore_displayurl)
				.addNextSibling(displayURLElem);
			parsed.root().get(HydrogenConfigMaps.xmlPaths.apimanager.apistore_displayurl).addPrevSibling(commentElem);
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.apistore_displayurl + '[1]')
				.remove();
			let altered = removeDeclaration(parsed.toString());
			let authManagerElem = altered.substring(altered.indexOf('<APIStore>'), altered.indexOf('</APIStore>'));

			let alteredElem = addHydrogeneratedElem(authManagerElem, '<DisplayURL>', 'changed');
			let _altered =
				altered.substring(0, altered.indexOf('<APIStore>')) +
				alteredElem +
				altered.substring(altered.indexOf('</APIStore>'));

			fs.writeFileSync(
				__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
				_altered,
				constants.utf8
			);
		});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter url of api store in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 * @param {number} [offset=0] offset value
 */
async function alterAPIStoreURL(args, workingDir = process.cwd(), offset = 0) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter URL of APIStore');

	try {
		await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let urlElem = new XMLJS.Element(
				doc,
				'URL',
				args._hostname + ':' + (HydrogenConfigMaps.ports._9443 + offset) + '/store'
			);

			let defaultElem = parsed.root().get(HydrogenConfigMaps.xmlPaths.apimanager.apistore_url);
			let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
			parsed.root().get(HydrogenConfigMaps.xmlPaths.apimanager.apistore_url).addNextSibling(urlElem);
			parsed.root().get(HydrogenConfigMaps.xmlPaths.apimanager.apistore_url).addPrevSibling(commentElem);
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.apimanager.apistore_url + '[1]')
				.remove();
			let altered = removeDeclaration(parsed.toString());
			let authManagerElem = altered.substring(altered.indexOf('<APIStore>'), altered.indexOf('</APIStore>'));

			let alteredElem = addHydrogeneratedElem(authManagerElem, '<URL>', 'changed');
			let _altered =
				altered.substring(0, altered.indexOf('<APIStore>')) +
				alteredElem +
				altered.substring(altered.indexOf('</APIStore>'));

			fs.writeFileSync(
				__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
				_altered,
				constants.utf8
			);
		});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter receiver url group of traffic manager in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 * @param {number} [offset=0] offset value
 * @param {{ version: string }} options configuration parameters and arguments to identify versions
 */
async function alterTrafficManagerReceiverURLGroup(
	args,
	workingDir = process.cwd(),
	offset = 0,
	options = { version: '2.6' }
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter Receiver URL Group of Traffic Manager');

	try {
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v26)
			await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
				let doc = new XMLJS.Document(parsed);
				let receiverURLElem = new XMLJS.Element(
					doc,
					'ReceiverUrlGroup',
					args._tcpHostname + ':' + (HydrogenConfigMaps.ports._9611 + offset)
				);

				let defaultElem = parsed
					.root()
					.get(
						HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_trafficmanager_receiverurlgroup
					);
				let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
				parsed
					.root()
					.get(
						HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_trafficmanager_receiverurlgroup
					)
					.addNextSibling(receiverURLElem);
				parsed
					.root()
					.get(
						HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_trafficmanager_receiverurlgroup
					)
					.addPrevSibling(commentElem);
				parsed
					.root()
					.get(
						HydrogenConfigMaps.xmlPaths.apimanager
							.throttlingconfigurations_trafficmanager_receiverurlgroup + '[1]'
					)
					.remove();
				let altered = removeDeclaration(parsed.toString());
				let authManagerElem = altered.substring(
					altered.indexOf('<TrafficManager>'),
					altered.indexOf('</TrafficManager>')
				);

				let alteredElem = addHydrogeneratedElem(authManagerElem, '<ReceiverUrlGroup>', 'changed');
				let _altered =
					altered.substring(0, altered.indexOf('<TrafficManager>')) +
					alteredElem +
					altered.substring(altered.indexOf('</TrafficManager>'));

				fs.writeFileSync(
					__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
					_altered,
					constants.utf8
				);
			});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter auth url group of traffic manager in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 * @param {number} [offset=0] offset value
 * @param {{ version: string }} options configuration parameters and arguments to identify versions
 */
async function alterTrafficManagerAuthURLGroup(
	args,
	workingDir = process.cwd(),
	offset = 0,
	options = { version: '2.6' }
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter Auth URL Group of Traffic Manager');

	try {
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v26)
			await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
				let doc = new XMLJS.Document(parsed);
				let authURLElem = new XMLJS.Element(
					doc,
					'AuthUrlGroup',
					args._sslHostname + ':' + (HydrogenConfigMaps.ports._9711 + offset)
				);

				let defaultElem = parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_trafficmanager_authurlgroup);
				let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_trafficmanager_authurlgroup)
					.addNextSibling(authURLElem);
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_trafficmanager_authurlgroup)
					.addPrevSibling(commentElem);
				parsed
					.root()
					.get(
						HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_trafficmanager_authurlgroup +
							'[1]'
					)
					.remove();
				let altered = removeDeclaration(parsed.toString());
				let authManagerElem = altered.substring(
					altered.indexOf('<TrafficManager>'),
					altered.indexOf('</TrafficManager>')
				);

				let alteredElem = addHydrogeneratedElem(authManagerElem, '<AuthUrlGroup>', 'changed');
				let _altered =
					altered.substring(0, altered.indexOf('<TrafficManager>')) +
					alteredElem +
					altered.substring(altered.indexOf('</TrafficManager>'));

				fs.writeFileSync(
					__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
					_altered,
					constants.utf8
				);
			});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter service url of policy deployer in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 * @param {number} [offset=0] offset value
 * @param {{ version: string }} options configuration parameters and arguments to identify versions
 */
async function alterPolicyDeployerServiceURL(
	args,
	workingDir = process.cwd(),
	offset = 0,
	options = { version: '2.6' }
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter ServiceURL of Policy Deployer');

	try {
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v26)
			await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
				let doc = new XMLJS.Document(parsed);
				let serviceURLElem = new XMLJS.Element(
					doc,
					'ServiceURL',
					args._hostname + ':' + (HydrogenConfigMaps.ports._9443 + offset) + '/services/'
				);

				let defaultElem = parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_policydeployer_serviceurl);
				let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_policydeployer_serviceurl)
					.addNextSibling(serviceURLElem);
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_policydeployer_serviceurl)
					.addPrevSibling(commentElem);
				parsed
					.root()
					.get(
						HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_policydeployer_serviceurl +
							'[1]'
					)
					.remove();
				let altered = removeDeclaration(parsed.toString());
				let authManagerElem = altered.substring(
					altered.indexOf('<PolicyDeployer>'),
					altered.indexOf('</PolicyDeployer>')
				);

				let alteredElem = addHydrogeneratedElem(authManagerElem, '<ServiceURL>', 'service url changed');
				let _altered =
					altered.substring(0, altered.indexOf('<PolicyDeployer>')) +
					alteredElem +
					altered.substring(altered.indexOf('</PolicyDeployer>'));

				fs.writeFileSync(
					__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
					_altered,
					constants.utf8
				);
			});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to add service url to the jms connection details in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} workingDir path of the current working directory
 * @param {number} offset offset value
 * @param {{ version: string }} options configuration parameters and arguments to identify versions
 */
async function addJMSConnectionDetailsServiceURL(
	args,
	workingDir = process.cwd(),
	offset = 0,
	options = { version: '2.6' }
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to add ServiceURL for JMSConnectionDetails');

	try {
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v26)
			await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
				let doc = new XMLJS.Document(parsed);
				let serviceURLElem = new XMLJS.Element(
					doc,
					'ServiceURL',
					args._tcpHostname + ':' + (HydrogenConfigMaps.ports._5672 + offset)
				);

				parsed
					.root()
					.get(
						HydrogenConfigMaps.xmlPaths.apimanager.throttlingconfigurations_jmsconnectiondetails_destination
					)
					.addNextSibling(serviceURLElem);
				let altered = removeDeclaration(parsed.toString());
				let jmsConnectionDetailsElem = altered.substring(
					altered.indexOf('<JMSConnectionDetails>'),
					altered.indexOf('</JMSConnectionDetails>')
				);

				let alteredElem = addHydrogeneratedElem(jmsConnectionDetailsElem, '<ServiceURL>', 'service url added');
				let _altered =
					altered.substring(0, altered.indexOf('<JMSConnectionDetails>')) +
					alteredElem +
					altered.substring(altered.indexOf('</JMSConnectionDetails>'));

				fs.writeFileSync(
					__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
					_altered,
					constants.utf8
				);
			});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter topic connection factory of jms connection parameters in api-manager.xml
 *
 * @param {{}} args configuration parameters and arguments
 * @param {string} workingDir path of the current working directory
 * @param {{ version: string }} options configuration parameters and arguments to identify versions
 */
async function alterJMSConnectionParametersTopicConnectionFactory(
	args,
	workingDir = process.cwd(),
	options = { version: '2.6' }
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter TopicConnectionFactory of JMSConnectionParameters');

	try {
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v26)
			await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
				let doc = new XMLJS.Document(parsed);
				let topicConnectionFactoryElem = new XMLJS.Element(
					doc,
					'connectionfactory.TopicConnectionFactory',
					"amqp://${admin.username}:${admin.password}@clientid/carbon?brokerlist='" +
						args._tcpHostname +
						':${jms.port}' +
						args.topicConnectionFactoryQuery
				);

				let defaultElemt = parsed
					.root()
					.get(
						HydrogenConfigMaps.xmlPaths.apimanager
							.throttlingconfigurations_jmsconnectiondetails_jmsconnectionparameters_connectionfactorytopicconnectionfactory
					);
				let commentElem = new XMLJS.Comment(doc, defaultElemt.toString());
				parsed
					.root()
					.get(
						HydrogenConfigMaps.xmlPaths.apimanager
							.throttlingconfigurations_jmsconnectiondetails_jmsconnectionparameters_connectionfactorytopicconnectionfactory
					)
					.addNextSibling(topicConnectionFactoryElem);
				parsed
					.root()
					.get(
						HydrogenConfigMaps.xmlPaths.apimanager
							.throttlingconfigurations_jmsconnectiondetails_jmsconnectionparameters_connectionfactorytopicconnectionfactory
					)
					.addPrevSibling(commentElem);
				parsed
					.root()
					.get(
						HydrogenConfigMaps.xmlPaths.apimanager
							.throttlingconfigurations_jmsconnectiondetails_jmsconnectionparameters_connectionfactorytopicconnectionfactory +
							'[1]'
					)
					.remove();
				let altered = removeDeclaration(parsed.toString());
				let jmsConnectionDetailsElem = altered.substring(
					altered.indexOf('<JMSConnectionParameters>'),
					altered.indexOf('</JMSConnectionParameters>')
				);

				let alteredElem = addHydrogeneratedElem(
					jmsConnectionDetailsElem,
					'<connectionfactory.TopicConnectionFactory>',
					'connection factory changed'
				);
				let _altered =
					altered.substring(0, altered.indexOf('<JMSConnectionParameters>')) +
					alteredElem +
					altered.substring(altered.indexOf('</JMSConnectionParameters>'));

				fs.writeFileSync(
					__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager),
					_altered,
					constants.utf8
				);
			});
	} catch (err) {
		logger.error(err);
	}
}

exports.addGatewayEnvironment = addGatewayEnvironment;
exports.alterAPIKeyValidatorEnableThriftServer = alterAPIKeyValidatorEnableThriftServer;
exports.alterAPIKeyValidatorKeyValidatorClientType = alterAPIKeyValidatorKeyValidatorClientType;
exports.alterAPIKeyValidatorServerURL = alterAPIKeyValidatorServerURL;
exports.alterAPIKeyValidatorThriftClientPort = alterAPIKeyValidatorThriftClientPort;
exports.alterAPIStoreDisplayURL = alterAPIStoreDisplayURL;
exports.alterAPIStoreURL = alterAPIStoreURL;
exports.alterAuthManagerServerURL = alterAuthManagerServerURL;
exports.alterBlockConditionEnabled = alterBlockConditionEnabled;
exports.alterDataPublisherEnabled = alterDataPublisherEnabled;
exports.alterGatewayEnvironmentGatewayEndpoint = alterGatewayEnvironmentGatewayEndpoint;
exports.alterGatewayEnvironmentServerURL = alterGatewayEnvironmentServerURL;
exports.alterJMSConnectionDetailsEnabled = alterJMSConnectionDetailsEnabled;
exports.alterOAuthConfigurationRevokeAPIURL = alterOAuthConfigurationRevokeAPIURL;
exports.alterPolicyDeployerEnabled = alterPolicyDeployerEnabled;
exports.alterPolicyDeployerServiceURL = alterPolicyDeployerServiceURL;
exports.alterTrafficManagerAuthURLGroup = alterTrafficManagerAuthURLGroup;
exports.alterTrafficManagerReceiverURLGroup = alterTrafficManagerReceiverURLGroup;
exports.addJMSConnectionDetailsServiceURL = addJMSConnectionDetailsServiceURL;
exports.alterJMSConnectionParametersTopicConnectionFactory = alterJMSConnectionParametersTopicConnectionFactory;
