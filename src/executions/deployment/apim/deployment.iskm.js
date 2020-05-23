'use strict';

const {
	alterAuthManagerServerURL,
	alterAPIKeyValidatorServerURL,
	alterGatewayEnvironmentServerURL,
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
const ora = require('ora');

/**
 * method to configure identity-server-as-key-manager
 *
 * @param {string} workingDir path of the working directory
 * @param {{}} datasourceConfs datasource configurations
 * @param {{}} iskmlayoutConfs layout configurations
 */
async function configureIdentityServerKM(
	workingDir,
	datasourceConfs,
	iskmlayoutConfs = { _hostname: 'https://localhost', offset: 1 }
) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Configuring Identity Server as Key Manager');
	const spinner = ora('Configuring Server :: Identity Server as Key Manager').start();

	try {
		await alterGatewayEnvironmentServerURL(iskmlayoutConfs, workingDir);
		await alterOAuthConfigurationRevokeAPIURL(iskmlayoutConfs, workingDir);

		await alterMasterDSofAM(datasourceConfs.am, workingDir);
		await alterMasterDSofUM(datasourceConfs.um, workingDir);
		await alterMasterDSofREG(datasourceConfs.reg, workingDir);

		await alterRegistry(datasourceConfs.reg, iskmlayoutConfs.offset, workingDir);
		await alterUserManagement(true, workingDir);

		await configurePortOffset(workingDir, iskmlayoutConfs.offset);
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
 */
async function configureAPIManagerwithISKM(
	workingDir,
	datasourceConfs,
	apimlayoutConfs = {
		_hostname: 'https://localhost',
		keyValidatorClientType: 'WSClient',
		enableThriftServer: 'false',
		iskmoffset: 1,
	}
) {
	if (process.env.HYDROGEN_DEBUG)
		logger.debug('Starting to configure API Manager with Identity Server as Key Manager ');
	const spinner = ora('Configuring Server :: API Manager').start();

	try {
		await alterAuthManagerServerURL(apimlayoutConfs, workingDir, apimlayoutConfs.iskmoffset);
		await alterAPIKeyValidatorServerURL(apimlayoutConfs, workingDir, apimlayoutConfs.iskmoffset);
		await alterAPIKeyValidatorKeyValidatorClientType(apimlayoutConfs, workingDir);
		await alterAPIKeyValidatorEnableThriftServer(apimlayoutConfs, workingDir);

		await alterMasterDSofAM(datasourceConfs.am, workingDir);
		await alterMasterDSofUM(datasourceConfs.um, workingDir);
		await alterMasterDSofREG(datasourceConfs.reg, workingDir);

		await alterRegistry(datasourceConfs.reg, 0, workingDir);
		await alterUserManagement(false, workingDir);
	} catch (err) {
		spinner.stop();
		logger.error(err);
	} finally {
		spinner.succeed();
	}
}

exports.configureIdentityServerKM = configureIdentityServerKM;
exports.configureAPIManagerwithISKM = configureAPIManagerwithISKM;
