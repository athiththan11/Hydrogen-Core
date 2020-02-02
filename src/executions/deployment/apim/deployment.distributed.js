'use strict';

const fs = require('fs-extra');
const __path = require('path');

const {
	alterAuthManagerServerURL,
	alterGatewayEnvironmentServerURL,
	alterAPIKeyValidatorServerURL,
	alterAPIKeyValidatorEnableThriftServer,
	alterOAuthConfigurationRevokeAPIURL,
	alterAPIKeyValidatorKeyValidatorClientType,
	alterGatewayEnvironmentGatewayEndpoint,
	alterDataPublisherEnabled,
	alterPolicyDeployerEnabled,
	alterBlockConditionEnabled,
	alterJMSConnectionDetailsEnabled,
	alterAPIStoreDisplayURL,
	alterAPIStoreURL,
	alterTrafficManagerReceiverURLGroup,
	alterTrafficManagerAuthURLGroup,
	alterPolicyDeployerServiceURL,
} = require('../../../modules/api.manager/apimanager.util');
const { configurePortOffset } = require('../../../modules/carbon/carbon.util');
const { alterUserManagement } = require('../../../modules/user.management/usermgt.util');
const { alterRegistry } = require('../../../modules/registry/registry.util');
const {
	alterMasterDSofAM,
	alterMasterDSofUM,
	alterMasterDSofREG,
} = require('../../../modules/master.datasource/datasource.util');

const HydrogenConfigMaps = require('../../../maps/map.hydrogen');
const { logger } = require('../../../utils/util.winston');

/**
 * method to configure traffic manager for the distributed deployment layout
 *
 * @param {string} workingDir path of the working directory
 * @param {{}} tmlayoutConfs traffic manager layout configurations
 */
// TESTME: offset configurations
async function configureTrafficManager(workingDir, tmlayoutConfs = { enableThriftServer: 'false', offset: 4 }) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Configuring Traffic Manager for Distributed deployment layout');

	// TESTME: Registry
	fs.removeSync(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.registry));
	fs.renameSync(
		__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.registryTM),
		__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.registry)
	);
	// TESTME: axis2
	fs.removeSync(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.axis2));
	fs.renameSync(
		__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.axis2TM),
		__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.axis2)
	);

	// TESTME: alter enable thrift server
	await alterAPIKeyValidatorEnableThriftServer(tmlayoutConfs, workingDir);
	// TESTME: offset
	await configurePortOffset(workingDir, tmlayoutConfs.offset);

	// TODO: profile optimization
}

/**
 * method to configure store for distributed deployment layout
 *
 * @param {string} workingDir path of the working directory
 * @param {{}} datasourceConfs datasource configurations
 * @param {{}} storelayoutConfs store layout configurations
 */
// TESTME: offset configurations
async function configureStore(
	workingDir,
	datasourceConfs,
	storelayoutConfs = {
		_hostname: 'https://localhost',
		keyValidatorClientType: 'WSCLient',
		enableThriftServer: 'false',
		enableDataPublisher: 'false',
		enablePolicyDeployer: 'false',
		enableBlockCondition: 'false',
		enableJMSConnectionDetails: 'false',
		gwoffset: 0,
		kmoffset: 1,
		offset: 3,
	}
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Configuring Store for Distributed deployment layout');

	// TESTME: auth manager server url : offset value
	await alterAuthManagerServerURL(storelayoutConfs, workingDir, storelayoutConfs.kmoffset);
	// TESTME: environment server url
	await alterGatewayEnvironmentServerURL(storelayoutConfs, workingDir, storelayoutConfs.gwoffset);
	// TESTME: gateway endpoint
	await alterGatewayEnvironmentGatewayEndpoint(storelayoutConfs, workingDir, storelayoutConfs.gwoffset);
	// TESTME: key validator server url
	await alterAPIKeyValidatorServerURL(storelayoutConfs, workingDir, storelayoutConfs.kmoffset);
	// TESTME: key validator client type
	await alterAPIKeyValidatorKeyValidatorClientType(storelayoutConfs, workingDir);
	// TESTME: enable thrift server
	await alterAPIKeyValidatorEnableThriftServer(storelayoutConfs, workingDir);
	// TESTME: revoke api url
	await alterOAuthConfigurationRevokeAPIURL(storelayoutConfs, workingDir, storelayoutConfs.gwoffset);
	// TESTME: data publisher
	await alterDataPublisherEnabled(storelayoutConfs, workingDir);
	// TESTME: policy deployer
	await alterPolicyDeployerEnabled(storelayoutConfs, workingDir);
	// TESTME: block condition enabled
	await alterBlockConditionEnabled(storelayoutConfs, workingDir);
	// TESTME: jms connection enabled
	await alterJMSConnectionDetailsEnabled(storelayoutConfs, workingDir);

	// TESTME: datasource
	await alterMasterDSofAM(datasourceConfs.am, workingDir);
	await alterMasterDSofUM(datasourceConfs.um, workingDir);
	await alterMasterDSofREG(datasourceConfs.reg, workingDir);
	// TESTME: user-mgt
	await alterUserManagement(false, workingDir);
	// TESTME: registry
	await alterRegistry(datasourceConfs.reg, storelayoutConfs.offset, workingDir);

	// TESTME: carbon offset 3
	await configurePortOffset(workingDir, storelayoutConfs.offset);

	// TODO: profile optimization
}

/**
 * method to configure publisher for distributed deployment layout
 *
 * @param {string} workingDir path of the working directory
 * @param {{}} datasourceConfs datasource configurations
 * @param {{}} publisherlayoutConfs publisher layout configurations
 */
// TESTME: offset configurations
async function configurePublisher(
	workingDir,
	datasourceConfs,
	publisherlayoutConfs = {
		_hostname: 'https://localhost',
		_tcpHostname: 'tcp://localhost',
		_sslHostname: 'ssl://localhost',
		enableThriftServer: 'false',
		enableDataPublisher: 'false',
		enableBlockCondition: 'false',
		enableJMSConnectionDetails: 'false',
		displayURL: 'true',
		gwoffset: 0,
		kmoffset: 1,
		storeoffset: 3,
		tmoffset: 4,
		offset: 2,
	}
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Configuring Publisher for Distributed deployment layout');

	// TESTME: authmanager server url : offset value
	await alterAuthManagerServerURL(publisherlayoutConfs, workingDir, publisherlayoutConfs.kmoffset);
	// TESTME: environment server url
	await alterGatewayEnvironmentServerURL(publisherlayoutConfs, workingDir, publisherlayoutConfs.gwoffset);
	// TESTME: gateway endpoint
	await alterGatewayEnvironmentGatewayEndpoint(publisherlayoutConfs, workingDir, publisherlayoutConfs.gwoffset);
	// TESTME: enable thrift server
	await alterAPIKeyValidatorEnableThriftServer(publisherlayoutConfs, workingDir);
	// TESTME: display URL
	await alterAPIStoreDisplayURL(publisherlayoutConfs, workingDir);
	// TESTME: API Store URL
	await alterAPIStoreURL(publisherlayoutConfs, workingDir, publisherlayoutConfs.storeoffset);
	// TESTME: receiver url
	await alterTrafficManagerReceiverURLGroup(publisherlayoutConfs, workingDir, publisherlayoutConfs.tmoffset);
	// TESTME: auth url group
	await alterTrafficManagerAuthURLGroup(publisherlayoutConfs, workingDir, publisherlayoutConfs.tmoffset);
	// TESTME: data publisher enabled
	await alterDataPublisherEnabled(publisherlayoutConfs, workingDir);
	// TESTME: policy deployer service url
	await alterPolicyDeployerServiceURL(publisherlayoutConfs, workingDir, publisherlayoutConfs.tmoffset);
	// TESTME: block condition
	await alterBlockConditionEnabled(publisherlayoutConfs, workingDir);
	// TESTME: jms connection
	await alterJMSConnectionDetailsEnabled(publisherlayoutConfs, workingDir);

	// TESTME: datasource
	await alterMasterDSofAM(datasourceConfs.am, workingDir);
	await alterMasterDSofUM(datasourceConfs.um, workingDir);
	await alterMasterDSofREG(datasourceConfs.reg, workingDir);
	// TESTME: user mgt
	await alterUserManagement(false, workingDir);
	// TESTME: registry
	await alterRegistry(datasourceConfs.reg, publisherlayoutConfs.offset, workingDir);
	// TODO: jndi properties

	// TESTME: carbon offset
	await configurePortOffset(workingDir, publisherlayoutConfs.offset);

	// TODO: profile optimization
}

// TODO: configure key manager
// TODO: configure gateway

exports.configureTrafficManager = configureTrafficManager;
exports.configureStore = configureStore;
exports.configurePublisher = configurePublisher;
