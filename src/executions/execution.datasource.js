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

// async function replaceCarbonDatasource(platform, workingDir, datasourceConfs) {
// 	// FIXME: check the replace datasource flow for api manager
// 	if (platform === 'apim') {
// 		await alterMasterDSofAM(workingDir, datasourceConfs);
// 	}

// 	if (platform === 'is') {
// 		await alterMasterDS(workingDir, datasourceConfs);
// 		await alterIdentity(workingDir, datasourceConfs._jndiName);
// 		await alterRegistry(workingDir, datasourceConfs);
// 	}
// }

// TODO: doc
async function replaceISCarbonDatasource(workingDir, datasourceConfs) {
    await alterMasterDS(workingDir, datasourceConfs);
    await alterIdentity(workingDir, datasourceConfs._jndiName);
    await alterRegistry(workingDir, datasourceConfs);
}

// TODO: doc
async function configureAPIManagerDatasources(workingDir, datasourceConfs) {
	await alterMasterDSofAM(workingDir, datasourceConfs.am);
	await alterMasterDSofUM(workingDir, datasourceConfs.um);
    await alterMasterDSofREG(workingDir, datasourceConfs.reg);
    await alterUserManagement(workingDir, false);
}

// exports.replaceCarbonDatasource = replaceCarbonDatasource;
exports.replaceISCarbonDatasource = replaceISCarbonDatasource;
exports.configureAPIManagerDatasources = configureAPIManagerDatasources;
