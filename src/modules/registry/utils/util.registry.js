'use strict';

const constants = require('../../../utils/constants');

/**
 * method to construct registry mounting configurations
 *
 * @param {*} Element libxmljs Element instance
 * @param {*} xmlDoc parsed libxmljs Document
 * @param {*} args registry parameters and config strings
 * @param {number} [offset=0] port offset value
 * @returns constructed registry mount configurations and elements [dbConfig, remoteInstance, mountGov, mountConf]
 */
function constructRegistry(Element, xmlDoc, args, offset = 0) {
	let dbConfig = new Element(xmlDoc, 'dbConfig').attr({ name: 'govregistry' });
    dbConfig.node('dataSource', args._jndiName);
    
    let remoteInstance = new Element(xmlDoc, 'remoteInstance').attr({ url: `https://localhost:${constants.ports._9443 + offset}/registry` });
	remoteInstance
		.node('id', 'gov')
		.parent()
		.node('cacheId', `${args._username}@${args._connectionUrl}`)
		.parent()
		.node('dbConfig', 'govregistry')
		.parent()
		.node('readOnly', 'false')
		.parent()
		.node('enableCache', 'true')
		.parent()
		.node('registryRoot', '/');

	let mountGov = new Element(xmlDoc, 'mount').attr({ path: '/_system/governance', overwrite: 'true' });
	mountGov
		.node('instanceId', 'gov')
		.parent()
		.node('targetPath', '/_system/governance');

	let mountConf = new Element(xmlDoc, 'mount').attr({ path: '/_system/config', overwrite: 'true' });
	mountConf
		.node('instanceId', 'gov')
		.parent()
		.node('targetPath', '/_system/config');

	return [dbConfig, remoteInstance, mountGov, mountConf];
}

exports.constructRegistry = constructRegistry;
