'use strict';

const {
	alterAuthManagerServerURL,
	alterAPIKeyValidatorServerURL,
	alterAPIKeyValidatorThriftClientPort,
	alterAPIKeyValidatorEnableThriftServer,
	alterOAuthConfigurationRevokeAPIURL,
	addGatewayEnvironment,
} = require('../../../modules/api.manager/apimanager.util');
const { configurePortOffset } = require('../../../modules/carbon/carbon.util');

const { logger } = require('../../../utils/util.winston');

/**
 * method to configure apim gateway pack for publish-multiple-gateway layout
 *
 * @param {*} workingDir path of the working directory
 * @param {{}} layoutConfs layout configuration arguments
 */
async function configureGateway(
	workingDir,
	layoutConfs = { _hostname: 'https://localhost', thriftClientPort: '10397', enableThriftServer: 'false', offset: 1 }
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Configuring API Manager as Gateway');

	await alterAuthManagerServerURL(layoutConfs, workingDir);
	await alterAPIKeyValidatorServerURL(layoutConfs, workingDir);
	await alterAPIKeyValidatorThriftClientPort(layoutConfs, workingDir);
	await alterAPIKeyValidatorEnableThriftServer(layoutConfs, workingDir);
	await alterOAuthConfigurationRevokeAPIURL(layoutConfs, workingDir);

	await configurePortOffset(workingDir, layoutConfs.offset);
}

/**
 * method to configure apim gateway aio pack for publish-multiple-gateway layout
 *
 * @param {*} workingDir path of the working directory
 * @param {[]} environmentConfsArray gateway environment configuration arguments
 */
async function configureGatewayAIO(workingDir, environmentConfsArray = []) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Configuring API Manager for Multiple Gateway Setup');

	// TODO: configurations
	// remove default : optional
	// add many gateway environments

	// loop through environmentConfsArray and configure AIO pack
	// TESTME: check the loop function
	environmentConfsArray.forEach((envConfs) => {
		let index = environmentConfsArray.indexOf(envConfs);
		((index) => {
			if (process.env.HYDROGEN_DEBUG) logger.debug('Add environment ' + index);
			addGatewayEnvironment(envConfs, workingDir);
		})(index);
	});
}

exports.configureGateway = configureGateway;
exports.configureGatewayAIO = configureGatewayAIO;
