'use strict';

const __path = require('path');
const fs = require('fs');
const XMLJS = require('libxmljs');

const constants = require('../../utils/constants');
const HydrogenConfigMaps = require('../../maps/map.hydrogen');
const { logger } = require('../../utils/util.winston');
const { parseXML, addHydrogeneratedElem, removeDeclaration } = require('../../utils/util.parser');
const { constructGatewayEnvironment } = require('./utils/util.apimanager');

/**
 * method to alter server of auth manager in api-manager.xml
 *
 * @param {*} args configuration parameters and arguments
 * @param {*} workingDir path of the current working directory
 */
async function alterAuthManagerServerURL(args, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter Server URL of AuthManager');

	try {
		await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let serverUrlElem = new XMLJS.Element(
				doc,
				'ServerURL',
				args._hostname + ':' + HydrogenConfigMaps.ports._9443 + '/services/'
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
 * @param {*} args configuration parameters and arguments
 * @param {*} [workingDir=process.cwd()] path of the current working directory
 */
async function alterAPIKeyValidatorServerURL(args, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter Server URL of APIKeyValidator');

	try {
		await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let serverUrlElem = new XMLJS.Element(
				doc,
				'ServerURL',
				args._hostname + ':' + HydrogenConfigMaps.ports._9443 + '/services/'
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
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter revoke api url of oauth-configurations in api-manager.xml
 *
 * @param {*} args configuration parameters and arguments
 * @param {*} [workingDir=process.cwd()] path of the current working directory
 */
async function alterOAuthConfigurationRevokeAPIURL(args, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter Revoke API URL of OAuthConfigurations');

	try {
		await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.apiManager)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let revokeAPIUrlElem = new XMLJS.Element(
				doc,
				'RevokeAPIURL',
				args._hostname + ':' + HydrogenConfigMaps.ports._8243 + '/revoke'
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

			let alteredElem = addHydrogeneratedElem(oauthConfigurationsElem, '<RevokeAPIURL>', 'revoke api url changed');
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
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter enable-thrift-server of api-key-validator in api-manager.xml
 *
 * @param {*} args configuration parameters and arguments
 * @param {*} [workingDir=process.cwd()] path of the current working directory
 */
async function alterAPIKeyValidatorEnableThriftServer(args, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter EnableThriftServer of APIKeyValidator');

	try {
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

			let alteredElem = addHydrogeneratedElem(authManagerElem, '<EnableThriftServer>', 'thrift server changed');
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
 * @param {*} args configuration parameters and arguments
 * @param {*} [workingDir=process.cwd()] path of the current working directory
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
 * method to add new gateway environment in api-manager.xml
 *
 * @param {*} environmentConfs gateway environment configuration parameters
 * @param {*} [workingDir=process.cwd()] path of the current working directory
 */
async function addGatewayEnvironment(environmentConfs, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to construct and add new Gateway Environment');

	try {
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

			// TESTME: check how addChild() works since the comment element has to be adjusted
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
	} catch (err) {
		logger.error(err);
	}
}

exports.alterAuthManagerServerURL = alterAuthManagerServerURL;
exports.alterAPIKeyValidatorServerURL = alterAPIKeyValidatorServerURL;
exports.alterOAuthConfigurationRevokeAPIURL = alterOAuthConfigurationRevokeAPIURL;
exports.alterAPIKeyValidatorEnableThriftServer = alterAPIKeyValidatorEnableThriftServer;
exports.alterAPIKeyValidatorThriftClientPort = alterAPIKeyValidatorThriftClientPort;
exports.addGatewayEnvironment = addGatewayEnvironment;
