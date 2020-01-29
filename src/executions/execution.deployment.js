'use strict';

const __path = require('path');
const fs = require('fs-extra');
// const { configureGateway, configureGatewayAIO } = require('./deployment/apim/deployment.multiplegw');

const { logger } = require('../utils/util.winston');

/**
 * method to configure deployment setup for Publish through Multiple Gateway
 *
 * @param {*} workingDir path of the working directory
 * @param {number} gwCount number of gateway nodes
 */
async function configurePublishMultipleGateway(workingDir, gwCount) {
	// TODO:
	// * make several copies of apim pack
	// * loop through the packs and configure (aio & gateway)

	try {
		// remove .DS_STORE on mac
		if (fs.existsSync(__path.join(workingDir, '.DS_STORE'))) {
			fs.removeSync(__path.join(workingDir, '.DS_STORE'));
		}

		let apimPackDir = __path.join(
			workingDir,
			fs.readdirSync(workingDir).filter((name) => {
				return name.startsWith('wso2am');
			})[0]
		);
		let deploymentDir = __path.join(workingDir, 'deployment');

		fs.mkdirSync(deploymentDir);
		// gateway count increased by 1 to include the aio pack on the loops
		await loopGatewayNodes(apimPackDir, deploymentDir, ++gwCount, 0);
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to make copies and to loop through gateway nodes to configure AIO and Gateway node servers
 *
 * @param {*} apimPackDir path of the wso2am pack directory (source)
 * @param {*} deploymentDir path of the deployment directory (deployment)
 * @param {number} gwCount number of gateway nodes
 * @param {number} loopCount loop count
 */
async function loopGatewayNodes(apimPackDir, deploymentDir, gwCount, loopCount) {
	// TODO: configure gateway nodes and AIO nodes

	if (loopCount < gwCount) {
		let packName = loopCount == 0 ? `gateway-aio` : `gateway-${loopCount}`;
		if (process.env.HYDROGEN_DEBUG) logger.debug('Configuring ' + packName);
		fs.copy(apimPackDir, __path.join(deploymentDir, packName))
			// .then(() => {
			//     let workingDir = __path.join(deploymentDir, packName);
			//     packName === 'gateway-aio' ? configureGatewayAIO(workingDir) : configureGateway(workingDir);
			// })
			.then(() => {
				loopGatewayNodes(apimPackDir, deploymentDir, gwCount, ++loopCount);
			})
			.catch((err) => {
				return logger.error(err);
			});
	}
}

exports.configurePublishMultipleGateway = configurePublishMultipleGateway;
