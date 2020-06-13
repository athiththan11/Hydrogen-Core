'use strict';

const {
	alterMasterDS,
	alterMasterDSofAM,
	alterMasterDSofUM,
	alterMasterDSofREG,
} = require('../modules/master.datasource/datasource.util');
const { alterIdentity } = require('../modules/identity/identity.util');
const { alterRegistry } = require('../modules/registry/registry.util');
const { alterUserManagement } = require('../modules/user.management/usermgt.util');

const { logger } = require('../utils/util.winston');
const ora = require('ora');

/**
 * method to alter and replace the H2 carbon datasource with other database types
 *
 * @param {string} workingDir path of the working directory
 * @param {{}} datasourceConfs datasource configuration arguments
 */
async function replaceISCarbonDatasource(workingDir, datasourceConfs) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Replacing IS H2 Carbon Datasource');

	const spinner = ora('Configuring Datasource').start();
	try {
		await alterMasterDS(datasourceConfs, workingDir);
		await alterIdentity(datasourceConfs._jndiName, workingDir);
		await alterRegistry(datasourceConfs, 0, workingDir);
	} catch (err) {
		if (spinner.isSpinning) spinner.fail();
		logger.error(err);
	} finally {
		if (spinner.isSpinning) spinner.succeed();
	}
}

/**
 * method to alter and replace the H2 AM datasource with other database types
 *
 * @param {string} workingDir path of the working directory
 * @param {{}} datasourceConfs datasource configuration arguments
 * @param {{}} options platform and product options
 */
async function replaceAPIManagerAMDatasource(workingDir, datasourceConfs, options) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Replacing API Manager AM Datasource');

	const spinner = ora('Configuring Datasource').start();
	try {
		await alterMasterDSofAM(datasourceConfs, workingDir, options);
	} catch (err) {
		if (spinner.isSpinning) spinner.fail();
		logger.error(err);
	} finally {
		if (spinner.isSpinning) spinner.succeed();
	}
}

/**
 * method to alter and configure datasources for api manager including AM, UM & REG DB
 *
 * @param {string} workingDir path of the working directory
 * @param {{am: {}, um: {}, reg: {}}} datasourceConfs datasource configuration arguments
 * @param {{}} options platform and product options
 */
async function configureAPIManagerDatasources(workingDir, datasourceConfs, options) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Configuring API Manager Datasources');
	const spinner = ora('Configuring Datasource').start();
	try {
		await alterMasterDSofAM(datasourceConfs.am, workingDir, options);
		await alterMasterDSofUM(datasourceConfs.um, workingDir, options);
		await alterMasterDSofREG(datasourceConfs.reg, workingDir, options);
		await alterRegistry(datasourceConfs.reg, 0, workingDir, options);
		await alterUserManagement(false, workingDir, options);
	} catch (err) {
		if (spinner.isSpinning) spinner.fail();
		logger.error(err);
	} finally {
		if (spinner.isSpinning) spinner.succeed();
	}
}

exports.replaceISCarbonDatasource = replaceISCarbonDatasource;
exports.replaceAPIManagerAMDatasource = replaceAPIManagerAMDatasource;
exports.configureAPIManagerDatasources = configureAPIManagerDatasources;
