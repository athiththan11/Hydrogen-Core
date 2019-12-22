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

/**
 * method to alter and replace the H2 carbon datasource with other database types
 *
 * @param {*} workingDir path of the working directory
 * @param {*} datasourceConfs datasource configuration arguments
 */
async function replaceISCarbonDatasource(workingDir, datasourceConfs) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Replacing IS H2 Carbon Datasource');

	await alterMasterDS(datasourceConfs, workingDir);
	await alterIdentity(datasourceConfs._jndiName, workingDir);
	await alterRegistry(datasourceConfs, 0, workingDir);
}

/**
 * method to alter and replace the H2 AM datasource with other database types
 *
 * @param {*} workingDir path of the working directory
 * @param {*} datasourceConfs datasource configuration arguments
 */
async function replaceAPIManagerAMDatasource(workingDir, datasourceConfs) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Replacing API Manager AM Datasource');

	await alterMasterDSofAM(datasourceConfs, workingDir);
}

/**
 * method to alter and configure datasources for api manager including AM, UM & REG DB
 * 
 * @param {*} workingDir path of the working directory
 * @param {*} datasourceConfs datasource configuration arguments
 */
async function configureAPIManagerDatasources(workingDir, datasourceConfs) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Configuring API Manager Datasources');
	
	await alterMasterDSofAM(datasourceConfs.am, workingDir);
	await alterMasterDSofUM(datasourceConfs.um, workingDir);
	await alterMasterDSofREG(datasourceConfs.reg, workingDir);
	await alterUserManagement(false, workingDir);
}

exports.replaceISCarbonDatasource = replaceISCarbonDatasource;
exports.replaceAPIManagerAMDatasource = replaceAPIManagerAMDatasource;
exports.configureAPIManagerDatasources = configureAPIManagerDatasources;
