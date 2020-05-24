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
 * @param {string} workingDir path of the working directory
 * @param {{}} layoutConfs layout configuration arguments
 * @param {{}} options platform and product options
 */
async function configureGateway(
	workingDir,
	layoutConfs = { _hostname: 'https://localhost', thriftClientPort: '10397', enableThriftServer: 'false', offset: 1 },
	options = {}
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Configuring API Manager as Gateway');

	try {
		if (options.version === '2.6') {
			await alterAuthManagerServerURL(layoutConfs, workingDir);
			await alterAPIKeyValidatorThriftClientPort(layoutConfs, workingDir);
		}

		await alterAPIKeyValidatorServerURL(layoutConfs, workingDir, undefined, options);
		await alterAPIKeyValidatorEnableThriftServer(layoutConfs, workingDir, options);
		await alterOAuthConfigurationRevokeAPIURL(layoutConfs, workingDir, undefined, options);

		await configurePortOffset(workingDir, layoutConfs.offset, options);
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to configure apim gateway aio pack for publish-multiple-gateway layout
 *
 * @param {string} workingDir path of the working directory
 * @param {[]} environmentConfsArray gateway environment configuration arguments
 * @param {{}} options platform and product options
 */
async function configureGatewayAIO(workingDir, environmentConfsArray = [], options = {}) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Configuring API Manager for Multiple Gateway Setup');

	// loop through environmentConfsArray and configure AIO pack
	try {
		await loopGatewayEnvConfs(workingDir, environmentConfsArray, 0, options);
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to loop through the gateway environment configurations and to configure api-manager.xml
 *
 * @param {string} workingDir path of the working directory
 * @param {[]} environmentConfs gateway environment configurations
 * @param {number} loopCount loop count
 * @param {{}} options platform and product options
 */
async function loopGatewayEnvConfs(workingDir, environmentConfs, loopCount, options = {}) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Looping through Gateway Environment Configurations');

	if (loopCount < environmentConfs.length) {
		if (process.env.HYDROGEN_DEBUG) logger.debug('Adding environment ' + loopCount);
		addGatewayEnvironment(environmentConfs[loopCount], workingDir, options)
			.then(() => {
				loopGatewayEnvConfs(workingDir, environmentConfs, ++loopCount, options);
			})
			.catch((err) => {
				logger.error(err);
			});
	}
}

exports.configureGateway = configureGateway;
exports.configureGatewayAIO = configureGatewayAIO;
