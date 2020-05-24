'use strict';

const {
	alterAuthManagerServerURL,
	alterAPIKeyValidatorServerURL,
	alterGatewayEnvironmentServerURL,
	addGatewayEnvironment,
	alterOAuthConfigurationRevokeAPIURL,
	alterAPIKeyValidatorEnableThriftServer,
	alterAPIKeyValidatorKeyValidatorClientType,
} = require('../../../modules/api.manager/apimanager.util');
const { configurePortOffset } = require('../../../modules/carbon/carbon.util');
const { alterUserManagement } = require('../../../modules/user.management/usermgt.util');
const { alterRegistry } = require('../../../modules/registry/registry.util');
const {
	alterMasterDSofAM,
	alterMasterDSofUM,
	alterMasterDSofREG,
} = require('../../../modules/master.datasource/datasource.util');

const { logger } = require('../../../utils/util.winston');
const { _environmentConfs } = require('../../../models/v3/confs.sample.model');
const ora = require('ora');

/**
 * method to configure identity-server-as-key-manager
 *
 * @param {string} workingDir path of the working directory
 * @param {{}} datasourceConfs datasource configurations
 * @param {{}} iskmlayoutConfs layout configurations
 * @param {{}} options platform and product options
 */
async function configureIdentityServerKM(
	workingDir,
	datasourceConfs,
	iskmlayoutConfs = { _hostname: 'https://localhost', offset: 1 },
	options = {}
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Configuring Identity Server as Key Manager');
	const spinner = ora('Configuring Server :: Identity Server as Key Manager').start();

	try {
		if (options.version === '2.6') await alterGatewayEnvironmentServerURL(iskmlayoutConfs, workingDir, options);
		if (options.version === '3.1') await addGatewayEnvironment(_environmentConfs, workingDir, options);

		await alterOAuthConfigurationRevokeAPIURL(iskmlayoutConfs, workingDir);

		await alterMasterDSofAM(datasourceConfs.am, workingDir, options);
		await alterMasterDSofUM(datasourceConfs.um, workingDir, options);
		await alterMasterDSofREG(datasourceConfs.reg, workingDir, options);

		await alterRegistry(datasourceConfs.reg, iskmlayoutConfs.offset, workingDir, options);
		await alterUserManagement(true, workingDir, options);

		await configurePortOffset(workingDir, iskmlayoutConfs.offset, options);
	} catch (err) {
		spinner.stop();
		logger.error(err);
	} finally {
		spinner.succeed();
	}
}

/**
 * method to configure apim server with is-km
 *
 * @param {string} workingDir path of the working directory
 * @param {{}} datasourceConfs datasource configurations
 * @param {{}} apimlayoutConfs layout configurations
 * @param {{}} options platform and product options
 */
async function configureAPIManagerwithISKM(
	workingDir,
	datasourceConfs,
	apimlayoutConfs = {
		_hostname: 'https://localhost',
		keyValidatorClientType: 'WSClient',
		enableThriftServer: 'false',
		iskmoffset: 1,
	},
	options = {}
) {
	if (process.env.HYDROGEN_DEBUG)
		logger.debug('Starting to configure API Manager with Identity Server as Key Manager ');
	const spinner = ora('Configuring Server :: API Manager').start();

	try {
		await alterAuthManagerServerURL(apimlayoutConfs, workingDir, apimlayoutConfs.iskmoffset, options);
		await alterAPIKeyValidatorServerURL(apimlayoutConfs, workingDir, apimlayoutConfs.iskmoffset, options);
		await alterAPIKeyValidatorKeyValidatorClientType(apimlayoutConfs, workingDir, options);
		await alterAPIKeyValidatorEnableThriftServer(apimlayoutConfs, workingDir, options);

		await alterMasterDSofAM(datasourceConfs.am, workingDir, options);
		await alterMasterDSofUM(datasourceConfs.um, workingDir, options);
		await alterMasterDSofREG(datasourceConfs.reg, workingDir, options);

		await alterRegistry(datasourceConfs.reg, 0, workingDir, options);
		await alterUserManagement(false, workingDir, options);
	} catch (err) {
		spinner.stop();
		logger.error(err);
	} finally {
		spinner.succeed();
	}
}

exports.configureIdentityServerKM = configureIdentityServerKM;
exports.configureAPIManagerwithISKM = configureAPIManagerwithISKM;
