'use strict';

const __path = require('path');
const { exec } = require('shelljs');

const HydrogenConfigMaps = require('../maps/map.hydrogen');
const { logger } = require('./util.winston');

/**
 * method to perform profile optimization
 *
 * @param {string} profile wso2 server profile
 * @param {string} opts command line arguments
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 */
async function optimizeProfile(profile, opts, workingDir = process.cwd()) {
	try {
		if (process.platform === 'win32') {
			let profileSetup = __path.join(workingDir, HydrogenConfigMaps.artifactPaths.bin.bat.profileSetup);
			exec(`bat ${profileSetup} -Dprofile=${profile}`, opts);
		} else {
			let profileSetup = __path.join(workingDir, HydrogenConfigMaps.artifactPaths.bin.sh.profileSetup);
			exec(`sh ${profileSetup} -Dprofile=${profile}`, opts);
		}
	} catch (err) {
		logger.error(err);
	}
}

exports.optimizeProfile = optimizeProfile;
