'use strict';

const __path = require('path');
const fs = require('fs-extra');
const { configureGatewayAIO, configureGateway } = require('./deployment/apim/deployment.multiplegw');
const { configureAPIManagerwithISKM, configureIdentityServerKM } = require('./deployment/apim/deployment.iskm');
const {
	configureTrafficManager,
	configureStore,
	configurePublisher,
	configureKeyManager,
	configureDistributedGateway,
} = require('./deployment/apim/deployment.distributed');

const HydrogenConfigMaps = require('../maps/map.hydrogen');
const { logger } = require('../utils/util.winston');
const ora = require('ora');

/**
 * method to configure deployment setup for publish-through-multiple-gateway
 *
 * @param {string} workingDir path of the working directory
 * @param {number} gwCount number of gateway nodes
 * @param {{}} layoutConfs layout configurations
 * @param {[]} environmentConfs gateway environment configurations
 */
async function configurePublishMultipleGateway(workingDir, gwCount, layoutConfs, environmentConfs) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to configure Publish-through-Multiple-Gateway layout');

	try {
		// remove .DS_STORE on mac
		if (fs.existsSync(__path.join(workingDir, '.DS_STORE'))) {
			fs.removeSync(__path.join(workingDir, '.DS_STORE'));
		}

		let apimPackDir = __path.join(
			workingDir,
			fs.readdirSync(workingDir).filter((name) => {
				return name.startsWith(HydrogenConfigMaps.servers.apim);
			})[0]
		);
		let deploymentDir = __path.join(workingDir, HydrogenConfigMaps.layoutNamePatterns.deployment);

		fs.mkdirSync(deploymentDir);
		// gateway count increased by 1 to include the aio pack on the loops
		await loopGatewayNodes(apimPackDir, deploymentDir, ++gwCount, 0, layoutConfs, environmentConfs);
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to make copies and to loop through gateway nodes to configure AIO and Gateway node servers
 *
 * @param {string} apimPackDir path of the wso2am pack directory (source)
 * @param {string} deploymentDir path of the deployment directory (deployment | target directory)
 * @param {number} gwCount number of gateway nodes
 * @param {number} loopCount loop count
 * @param {{}} layoutConfs layout configurations
 * @param {[]} environmentConfs gateway environment configurations
 */
async function loopGatewayNodes(apimPackDir, deploymentDir, gwCount, loopCount, layoutConfs, environmentConfs) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Looping through Gateway nodes');

	if (loopCount < gwCount) {
		let packName =
			loopCount == 0
				? HydrogenConfigMaps.layoutNamePatterns.apim.publishMultipleGateway.aio
				: `${HydrogenConfigMaps.layoutNamePatterns.apim.publishMultipleGateway.gw_node}${loopCount}`;
		if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to configure ' + packName);
		const spinner = ora('Configuring Server :: ' + packName).start();

		fs.copy(apimPackDir, __path.join(deploymentDir, packName))
			.then(() => {
				let workingDir = __path.join(deploymentDir, packName);
				if (packName === HydrogenConfigMaps.layoutNamePatterns.apim.publishMultipleGateway.aio) {
					configureGatewayAIO(workingDir, environmentConfs)
						.then(() => {
							loopGatewayNodes(apimPackDir, deploymentDir, gwCount, ++loopCount, layoutConfs);
							spinner.succeed();
						})
						.catch((err) => {
							logger.error(err);
						});
				} else {
					layoutConfs.offset += 1;
					configureGateway(workingDir, layoutConfs)
						.then(() => {
							loopGatewayNodes(apimPackDir, deploymentDir, gwCount, ++loopCount, layoutConfs);
							spinner.succeed();
						})
						.catch((err) => {
							logger.error(err);
						});
				}
			})
			.catch((err) => {
				logger.error(err);
			});
	}
}

/**
 * method to configure deployment setup for identity-server-as-key-manager
 *
 * @param {string} workingDir path of the working directory
 * @param {{}} datasourceConfs datasource configurations
 * @param {{}} apimlayoutConfs apim related layout configurations
 * @param {{}} iskmlayoutConfs is-km related layout configurations
 * @param {{}} options platform and product options
 */
async function configureIdentityServerasKeyManager(
	workingDir,
	datasourceConfs,
	apimlayoutConfs,
	iskmlayoutConfs,
	options
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to configure Identity Server as Key Manager layout');

	try {
		// remove .DS_STORE on mac
		if (fs.existsSync(__path.join(workingDir, '.DS_STORE'))) {
			fs.removeSync(__path.join(workingDir, '.DS_STORE'));
		}

		let apimPackDir = __path.join(
			workingDir,
			fs.readdirSync(workingDir).filter((name) => {
				return name.startsWith(HydrogenConfigMaps.servers.apim);
			})[0]
		);
		let iskmPackDir = __path.join(
			workingDir,
			fs.readdirSync(workingDir).filter((name) => {
				return name.startsWith(HydrogenConfigMaps.servers.iskm);
			})[0]
		);

		await configureIdentityServerKM(iskmPackDir, datasourceConfs, iskmlayoutConfs, options);
		await configureAPIManagerwithISKM(apimPackDir, datasourceConfs, apimlayoutConfs, options);
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to configure deployment setup for distributed deployment layout
 *
 * @param {string} workingDir path of the working directory
 * @param {{}} datasourceConfs datasource configurations
 * @param {{publisherlayoutConfs: {}, storelayoutConfs: {}, tmlayoutConfs: {}}} distributedLayoutConfs distributed layout configurations
 */
async function configureDistributedDeployment(workingDir, datasourceConfs, distributedLayoutConfs) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to configure Distributed deployment layout');

	try {
		// remove .DS_STORE on mac
		if (fs.existsSync(__path.join(workingDir, '.DS_STORE'))) {
			fs.removeSync(__path.join(workingDir, '.DS_STORE'));
		}

		let apimPackDir = __path.join(
			workingDir,
			fs.readdirSync(workingDir).filter((name) => {
				return name.startsWith(HydrogenConfigMaps.servers.apim);
			})[0]
		);
		let deploymentDir = __path.join(workingDir, HydrogenConfigMaps.layoutNamePatterns.deployment);
		fs.mkdirSync(deploymentDir);

		await loopDistributedNodes(apimPackDir, deploymentDir, 0, datasourceConfs, distributedLayoutConfs);
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to loop through the distributed nodes and configure
 *
 * @param {string} apimPackDir path of the apim server directory
 * @param {string} deploymentDir path of the deployment directory
 * @param {number} loopCount loop count
 * @param {{}} datasourceConfs datasource configurations
 * @param {{gatewaylayoutConfs: {}, kmlayoutConfs: {}, publisherlayoutConfs: {}, storelayoutConfs: {}, tmlayoutConfs: {}}} distributedLayoutConfs distributed layout configurations
 */
async function loopDistributedNodes(apimPackDir, deploymentDir, loopCount, datasourceConfs, distributedLayoutConfs) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Looping through Distributed nodes');

	if (loopCount < HydrogenConfigMaps.layoutNamePatterns.apim.distributed.names.length) {
		let packName = HydrogenConfigMaps.layoutNamePatterns.apim.distributed.names[loopCount];
		if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to configure ' + packName);
		const spinner = ora('Configuring & Optimizing Server :: ' + packName + ' ').start();

		fs.copy(apimPackDir, __path.join(deploymentDir, packName))
			.then(() => {
				let workingDir = __path.join(deploymentDir, packName);
				if (packName === HydrogenConfigMaps.layoutNamePatterns.apim.distributed.gateway) {
					configureDistributedGateway(workingDir, distributedLayoutConfs.gatewaylayoutConfs)
						.then(() => {
							loopDistributedNodes(
								apimPackDir,
								deploymentDir,
								++loopCount,
								datasourceConfs,
								distributedLayoutConfs
							);
							spinner.succeed('Configured & Optimized :: ' + packName);
						})
						.catch((err) => {
							spinner.stop();
							logger.error(err);
						});
				}
				if (packName === HydrogenConfigMaps.layoutNamePatterns.apim.distributed.keymanager) {
					configureKeyManager(workingDir, datasourceConfs, distributedLayoutConfs.kmlayoutConfs)
						.then(() => {
							loopDistributedNodes(
								apimPackDir,
								deploymentDir,
								++loopCount,
								datasourceConfs,
								distributedLayoutConfs
							);
							spinner.succeed('Configured & Optimized :: ' + packName);
						})
						.catch((err) => {
							spinner.stop();
							logger.error(err);
						});
				}
				if (packName === HydrogenConfigMaps.layoutNamePatterns.apim.distributed.publisher) {
					configurePublisher(workingDir, datasourceConfs, distributedLayoutConfs.publisherlayoutConfs)
						.then(() => {
							loopDistributedNodes(
								apimPackDir,
								deploymentDir,
								++loopCount,
								datasourceConfs,
								distributedLayoutConfs
							);
							spinner.succeed();
						})
						.catch((err) => {
							spinner.stop();
							logger.error(err);
						});
				}
				if (packName === HydrogenConfigMaps.layoutNamePatterns.apim.distributed.store) {
					configureStore(workingDir, datasourceConfs, distributedLayoutConfs.storelayoutConfs)
						.then(() => {
							loopDistributedNodes(
								apimPackDir,
								deploymentDir,
								++loopCount,
								datasourceConfs,
								distributedLayoutConfs
							);
							spinner.succeed('Configured & Optimized :: ' + packName);
						})
						.catch((err) => {
							spinner.stop();
							logger.error(err);
						});
				}
				if (packName === HydrogenConfigMaps.layoutNamePatterns.apim.distributed.trafficmanager) {
					configureTrafficManager(workingDir, distributedLayoutConfs.tmlayoutConfs)
						.then(() => {
							loopDistributedNodes(
								apimPackDir,
								deploymentDir,
								++loopCount,
								datasourceConfs,
								distributedLayoutConfs
							);
							spinner.succeed('Configured & Optimized :: ' + packName);
						})
						.catch((err) => {
							spinner.stop();
							logger.error(err);
						});
				}
			})
			.catch((err) => {
				spinner.stop();
				logger.error(err);
			});
	}
}

exports.configurePublishMultipleGateway = configurePublishMultipleGateway;
exports.configureIdentityServerasKeyManager = configureIdentityServerasKeyManager;
exports.configureDistributedDeployment = configureDistributedDeployment;
