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
	addJMSConnectionDetailsServiceURL,
	alterJMSConnectionParametersTopicConnectionFactory,
} = require('../../../modules/api.manager/apimanager.util');
const { alterJNDIProperties } = require('../../../modules/jndi.properties/jndi.util');
const { configurePortOffset } = require('../../../modules/carbon/carbon.util');
const { alterUserManagement } = require('../../../modules/user.management/usermgt.util');
const { alterRegistry } = require('../../../modules/registry/registry.util');
const {
	alterMasterDSofAM,
	alterMasterDSofUM,
	alterMasterDSofREG,
} = require('../../../modules/master.datasource/datasource.util');
const { optimizeProfile } = require('../../../utils/util.profile');

const HydrogenConfigMaps = require('../../../maps/map.hydrogen');
const { logger } = require('../../../utils/util.winston');

/**
 * method to configure traffic manager for the distributed deployment layout
 *
 * @param {string} workingDir path of the working directory
 * @param {{}} tmlayoutConfs traffic manager layout configurations
 */
async function configureTrafficManager(workingDir, tmlayoutConfs = { enableThriftServer: 'false', offset: 4 }) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Configuring Traffic Manager for Distributed deployment layout');

	try {
		fs.removeSync(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.registry));
		fs.renameSync(
			__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.registryTM),
			__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.registry)
		);

		fs.removeSync(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.axis2));
		fs.renameSync(
			__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.axis2TM),
			__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.axis2)
		);

		await alterAPIKeyValidatorEnableThriftServer(tmlayoutConfs, workingDir);
        await configurePortOffset(workingDir, tmlayoutConfs.offset);
        
        await optimizeProfile(HydrogenConfigMaps.profiles.trafficmanager, '', workingDir);
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to configure store for distributed deployment layout
 *
 * @param {string} workingDir path of the working directory
 * @param {{}} datasourceConfs datasource configurations
 * @param {{}} storelayoutConfs store layout configurations
 */
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

	try {
		await alterAuthManagerServerURL(storelayoutConfs, workingDir, storelayoutConfs.kmoffset);
		await alterGatewayEnvironmentServerURL(storelayoutConfs, workingDir, storelayoutConfs.gwoffset);
		await alterGatewayEnvironmentGatewayEndpoint(storelayoutConfs, workingDir, storelayoutConfs.gwoffset);
		await alterAPIKeyValidatorServerURL(storelayoutConfs, workingDir, storelayoutConfs.kmoffset);
		await alterAPIKeyValidatorKeyValidatorClientType(storelayoutConfs, workingDir);
		await alterAPIKeyValidatorEnableThriftServer(storelayoutConfs, workingDir);
		await alterOAuthConfigurationRevokeAPIURL(storelayoutConfs, workingDir, storelayoutConfs.gwoffset);
		await alterDataPublisherEnabled(storelayoutConfs, workingDir);
		await alterPolicyDeployerEnabled(storelayoutConfs, workingDir);
		await alterBlockConditionEnabled(storelayoutConfs, workingDir);
		await alterJMSConnectionDetailsEnabled(storelayoutConfs, workingDir);

		await alterMasterDSofAM(datasourceConfs.am, workingDir);
		await alterMasterDSofUM(datasourceConfs.um, workingDir);
		await alterMasterDSofREG(datasourceConfs.reg, workingDir);
		await alterUserManagement(false, workingDir);
		await alterRegistry(datasourceConfs.reg, storelayoutConfs.offset, workingDir);

        await configurePortOffset(workingDir, storelayoutConfs.offset);
        
        await optimizeProfile(HydrogenConfigMaps.profiles.store, '', workingDir);
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to configure publisher for distributed deployment layout
 *
 * @param {string} workingDir path of the working directory
 * @param {{}} datasourceConfs datasource configurations
 * @param {{}} publisherlayoutConfs publisher layout configurations
 */
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

	try {
		await alterAuthManagerServerURL(publisherlayoutConfs, workingDir, publisherlayoutConfs.kmoffset);
		await alterGatewayEnvironmentServerURL(publisherlayoutConfs, workingDir, publisherlayoutConfs.gwoffset);
		await alterGatewayEnvironmentGatewayEndpoint(publisherlayoutConfs, workingDir, publisherlayoutConfs.gwoffset);
		await alterAPIKeyValidatorEnableThriftServer(publisherlayoutConfs, workingDir);
		await alterAPIStoreDisplayURL(publisherlayoutConfs, workingDir);
		await alterAPIStoreURL(publisherlayoutConfs, workingDir, publisherlayoutConfs.storeoffset);
		await alterTrafficManagerReceiverURLGroup(publisherlayoutConfs, workingDir, publisherlayoutConfs.tmoffset);
		await alterTrafficManagerAuthURLGroup(publisherlayoutConfs, workingDir, publisherlayoutConfs.tmoffset);
		await alterDataPublisherEnabled(publisherlayoutConfs, workingDir);
		await alterPolicyDeployerServiceURL(publisherlayoutConfs, workingDir, publisherlayoutConfs.tmoffset);
		await alterBlockConditionEnabled(publisherlayoutConfs, workingDir);
		await alterJMSConnectionDetailsEnabled(publisherlayoutConfs, workingDir);

		await alterMasterDSofAM(datasourceConfs.am, workingDir);
		await alterMasterDSofUM(datasourceConfs.um, workingDir);
		await alterMasterDSofREG(datasourceConfs.reg, workingDir);
		await alterUserManagement(false, workingDir);
		await alterRegistry(datasourceConfs.reg, publisherlayoutConfs.offset, workingDir);

		await alterJNDIProperties(publisherlayoutConfs, workingDir, publisherlayoutConfs.tmoffset);

        await configurePortOffset(workingDir, publisherlayoutConfs.offset);
        
        await optimizeProfile(HydrogenConfigMaps.profiles.publisher, '', workingDir);
	} catch (err) {
		logger.error(err);
	}
}

/**
 * metho to configure keymanager for distributed deployment layout
 *
 * @param {string} workingDir path of the working directory
 * @param {{}} datasourceConfs datasource configurations
 * @param {{}} kmlayoutConfs keymanager layout configurations
 */
async function configureKeyManager(
	workingDir,
	datasourceConfs,
	kmlayoutConfs = {
		_hostname: 'https://localhost',
		keyValidatorClientType: 'WSCLient',
		enableThriftServer: 'false',
		enablePolicyDeployer: 'false',
		gwoffset: 0,
		offset: 1,
	}
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Configuring Key Manager for Distributed deployment layout');

	try {
		await alterGatewayEnvironmentServerURL(kmlayoutConfs, workingDir, kmlayoutConfs.gwoffset);
		await alterAPIKeyValidatorKeyValidatorClientType(kmlayoutConfs, workingDir);
		await alterAPIKeyValidatorEnableThriftServer(kmlayoutConfs, workingDir);
		await alterPolicyDeployerEnabled(kmlayoutConfs, workingDir);

		await alterMasterDSofAM(datasourceConfs.am, workingDir);
		await alterMasterDSofUM(datasourceConfs.um, workingDir);
		await alterMasterDSofREG(datasourceConfs.reg, workingDir);
		await alterUserManagement(false, workingDir);
		await alterRegistry(datasourceConfs.reg, kmlayoutConfs.offset, workingDir);

        await configurePortOffset(workingDir, kmlayoutConfs.offset);
        
        await optimizeProfile(HydrogenConfigMaps.profiles.keymanager, '', workingDir);
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to configure gateway for distributed deployment layout
 *
 * @param {string} workingDir path of the current working directory
 * @param {{}} gatewaylayoutConfs gateway layout configurations
 */
async function configureDistributedGateway(
	workingDir,
	gatewaylayoutConfs = {
		_hostname: 'https://localhost',
		_tcpHostname: 'tcp://localhost',
		_sslHostname: 'ssl://localhost',
		keyValidatorClientType: 'WSCLient',
		enableThriftServer: 'false',
		enablePolicyDeployer: 'false',
		topicConnectionFactoryQuery: "?retries='5'%26connectdelay='50''",
		kmoffset: 1,
		tmoffset: 4,
		offset: 0,
	}
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Configuring Gateway for Distributed deployment layout');

	try {
		await alterAPIKeyValidatorServerURL(gatewaylayoutConfs, workingDir, gatewaylayoutConfs.kmoffset);
		await alterAPIKeyValidatorKeyValidatorClientType(gatewaylayoutConfs, workingDir);
		await alterAPIKeyValidatorEnableThriftServer(gatewaylayoutConfs, workingDir);
		await alterTrafficManagerReceiverURLGroup(gatewaylayoutConfs, workingDir, gatewaylayoutConfs.tmoffset);
		await alterTrafficManagerAuthURLGroup(gatewaylayoutConfs, workingDir, gatewaylayoutConfs.tmoffset);
		await alterPolicyDeployerEnabled(gatewaylayoutConfs, workingDir);
		await alterPolicyDeployerServiceURL(gatewaylayoutConfs, workingDir, gatewaylayoutConfs.tmoffset);
		await addJMSConnectionDetailsServiceURL(gatewaylayoutConfs, workingDir, gatewaylayoutConfs.tmoffset);
		await alterJMSConnectionParametersTopicConnectionFactory(gatewaylayoutConfs, workingDir);

        await configurePortOffset(workingDir, gatewaylayoutConfs.offset);
        
        await optimizeProfile(HydrogenConfigMaps.profiles.gateway, '', workingDir);
	} catch (err) {
		logger.error(err);
	}
}

exports.configureTrafficManager = configureTrafficManager;
exports.configureStore = configureStore;
exports.configurePublisher = configurePublisher;
exports.configureKeyManager = configureKeyManager;
exports.configureDistributedGateway = configureDistributedGateway;
