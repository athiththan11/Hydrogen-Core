'use strict';

const __path = require('path');
const fs = require('fs');

const HydrogenConfigMaps = require('../maps/map.hydrogen');

/**
 * method to read and return postgre sql scripts
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {*} workingDir path of the working directory
 * @returns combined SQL script
 */
async function readPostgreSQLScripts(platform, workingDir = process.cwd()) {
	let scripts = [];

	if (platform === HydrogenConfigMaps.platform.is) {
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.is.dbscripts,
						HydrogenConfigMaps.datasource.scripts.postgre
					)
				)
				.toString()
		);
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.is.identity,
						HydrogenConfigMaps.datasource.scripts.postgre
					)
				)
				.toString()
		);
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.is.storedProcedure,
						HydrogenConfigMaps.datasource.postgre,
						HydrogenConfigMaps.datasource.scripts.postgre
					)
				)
				.toString()
		);
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.is.uma,
						HydrogenConfigMaps.datasource.scripts.postgre
					)
				)
				.toString()
		);
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.is.consent,
						HydrogenConfigMaps.datasource.scripts.postgre
					)
				)
				.toString()
		);
	}

	if (platform === HydrogenConfigMaps.platform.apim) {
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.apim.apimgt,
						HydrogenConfigMaps.datasource.scripts.postgre
					)
				)
				.toString()
		);
	}

	return scripts.join('\n');
}

/**
 * method to read and return mysql sql scripts
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {*} workingDir path of the working directory
 * @returns combined SQL script
 */
async function readMySQLScripts(platform, workingDir = process.cwd()) {
	let scripts = [];

	if (platform === HydrogenConfigMaps.platform.is) {
		scripts.push(HydrogenConfigMaps.scripts.mysql.allowInvalidDates);
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.is.dbscripts,
						HydrogenConfigMaps.datasource.scripts.mysql
					)
				)
				.toString()
		);
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.is.identity,
						HydrogenConfigMaps.datasource.scripts.mysql
					)
				)
				.toString()
		);
		// scripts.push(fs.readFileSync(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.scripts.is.storedProcedure, HydrogenConfigMap.datasource.mysql, HydrogenConfigMaps.datasource.scripts.mysql)).toString());
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.is.uma,
						HydrogenConfigMaps.datasource.scripts.mysql
					)
				)
				.toString()
		);
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.is.consent,
						HydrogenConfigMaps.datasource.scripts.mysql
					)
				)
				.toString()
		);
	}

	if (platform === HydrogenConfigMaps.platform.apim) {
		scripts.push(HydrogenConfigMaps.scripts.mysql.allowInvalidDates);
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.apim.apimgt,
						HydrogenConfigMaps.datasource.scripts.mysql
					)
				)
				.toString()
		);
	}

	return scripts.join('');
}

/**
 * method to read and return mssql sql scripts
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {*} workingDir path of the working directory
 * @returns combined SQL script
 */
async function readMSSQLScripts(platform, workingDir = process.cwd()) {
	let scripts = [];

	if (platform === HydrogenConfigMaps.platform.is) {
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.is.dbscripts,
						HydrogenConfigMaps.datasource.scripts.mssql
					)
				)
				.toString()
		);
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.is.identity,
						HydrogenConfigMaps.datasource.scripts.mssql
					)
				)
				.toString()
		);
		// scripts.push(fs.readFileSync(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.scripts.is.storedProcedure, HydrogenConfigMap.datasource.mssql, HydrogenConfigMaps.datasource.scripts.mssql)).toString());
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.is.uma,
						HydrogenConfigMaps.datasource.scripts.mssql
					)
				)
				.toString()
		);
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.is.consent,
						HydrogenConfigMaps.datasource.scripts.mssql
					)
				)
				.toString()
		);
	}

	if (platform === HydrogenConfigMaps.platform.apim) {
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.apim.apimgt,
						HydrogenConfigMaps.datasource.scripts.mssql
					)
				)
				.toString()
		);
	}

	return scripts.join('');
}

/**
 * method to read and return postgre sql scripts for api manager datasources including am, um, & reg db
 *
 * @param {*} options command options
 * @param {*} [workingDir=process.cwd()] path of the working directory
 * @returns a collection of scripts for am, um & reg dbs
 */
async function readAPIManagerPostgresSQLScripts(options, workingDir = process.cwd()) {
	let scripts = [];

	if (!options[HydrogenConfigMaps.platform.iskm] && !options.distributed) {
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.apim.apimgt,
						HydrogenConfigMaps.datasource.scripts.postgre
					)
				)
				.toString()
		);
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.apim.dbscripts,
						HydrogenConfigMaps.datasource.scripts.postgre
					)
				)
				.toString()
		);
	}

	if (options[HydrogenConfigMaps.platform.iskm] || options.distributed) {
		let rootDir = fs.readdirSync(workingDir);
		while (rootDir.length >= 0) {
			let apimPack = rootDir.shift();
			if (apimPack.startsWith(HydrogenConfigMaps.servers.apim)) {
				scripts.push(
					fs
						.readFileSync(
							__path.join(
								workingDir,
								apimPack,
								HydrogenConfigMaps.artifactPaths.scripts.apim.apimgt,
								HydrogenConfigMaps.datasource.scripts.postgre
							)
						)
						.toString()
				);
				scripts.push(
					fs
						.readFileSync(
							__path.join(
								workingDir,
								apimPack,
								HydrogenConfigMaps.artifactPaths.scripts.apim.dbscripts,
								HydrogenConfigMaps.datasource.scripts.postgre
							)
						)
						.toString()
				);
				break;
			}
		}
	}

	// keywords are matched to be in hydrogen config maps > docker > apim.setup
	let scriptCollection = {
		apimgtdb: scripts[0],
		userdb: scripts[1],
		regdb: scripts[1],
	};
	return scriptCollection;
}

/**
 * method to read and return mysql sql scripts for api manager datasources including am, um, & reg db
 *
 * @param {*} options command options
 * @param {*} [workingDir=process.cwd()] path of the working directory
 * @returns a collection of scripts for am, um & reg dbs
 */
async function readAPIManagerMySQLScripts(options, workingDir = process.cwd()) {
	let scripts = [];

	if (!options[HydrogenConfigMaps.platform.iskm] && !options.distributed) {
		scripts.push(HydrogenConfigMaps.scripts.mysql.allowInvalidDates);
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.apim.apimgt,
						HydrogenConfigMaps.datasource.scripts.mysql
					)
				)
				.toString()
		);
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.apim.dbscripts,
						HydrogenConfigMaps.datasource.scripts.mysql
					)
				)
				.toString()
		);
	}

	if (options[HydrogenConfigMaps.platform.iskm] || options.distributed) {
		let rootDir = fs.readdirSync(workingDir);
		while (rootDir.length >= 0) {
			let apimPack = rootDir.shift();
			if (apimPack.startsWith(HydrogenConfigMaps.servers.apim)) {
				scripts.push(HydrogenConfigMaps.scripts.mysql.allowInvalidDates);
				scripts.push(
					fs
						.readFileSync(
							__path.join(
								workingDir,
								apimPack,
								HydrogenConfigMaps.artifactPaths.scripts.apim.apimgt,
								HydrogenConfigMaps.datasource.scripts.mysql
							)
						)
						.toString()
				);
				scripts.push(
					fs
						.readFileSync(
							__path.join(
								workingDir,
								apimPack,
								HydrogenConfigMaps.artifactPaths.scripts.apim.dbscripts,
								HydrogenConfigMaps.datasource.scripts.mysql
							)
						)
						.toString()
				);
				break;
			}
		}
	}

	// keywords are matched to be in hydrogen config maps > docker > apim.setup
	let scriptCollection = {
		apimgtdb: scripts[0],
		userdb: scripts[1],
		regdb: scripts[1],
	};
	return scriptCollection;
}

/**
 * method to read and return mssql sql scripts for api manager datasources including am, um, & reg db
 *
 * @param {*} options command options
 * @param {*} [workingDir=process.cwd()] path of the working directory
 * @returns a collection of scripts for am, um & reg dbs
 */
async function readAPIManagerMSSQLScripts(options, workingDir = process.cwd()) {
	let scripts = [];

	if (!options[HydrogenConfigMaps.platform.iskm] && !options.distributed) {
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.apim.apimgt,
						HydrogenConfigMaps.datasource.scripts.mssql
					)
				)
				.toString()
		);
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.apim.dbscripts,
						HydrogenConfigMaps.datasource.scripts.mssql
					)
				)
				.toString()
		);
	}

	if (options[HydrogenConfigMaps.platform.iskm] || options.distributed) {
		let rootDir = fs.readdirSync(workingDir);
		while (rootDir.length >= 0) {
			let apimPack = rootDir.shift();
			if (apimPack.startsWith(HydrogenConfigMaps.servers.apim)) {
				scripts.push(
					fs
						.readFileSync(
							__path.join(
								workingDir,
								apimPack,
								HydrogenConfigMaps.artifactPaths.scripts.apim.apimgt,
								HydrogenConfigMaps.datasource.scripts.mssql
							)
						)
						.toString()
				);
				scripts.push(
					fs
						.readFileSync(
							__path.join(
								workingDir,
								apimPack,
								HydrogenConfigMaps.artifactPaths.scripts.apim.dbscripts,
								HydrogenConfigMaps.datasource.scripts.mssql
							)
						)
						.toString()
				);
				break;
			}
		}
	}

	// keywords are matched to be in hydrogen config maps > docker > apim.setup
	let scriptCollection = {
		apimgtdb: scripts[0],
		userdb: scripts[1],
		regdb: scripts[1],
	};
	return scriptCollection;
}

exports.readPostgreSQLScripts = readPostgreSQLScripts;
exports.readMySQLScripts = readMySQLScripts;
exports.readMSSQLScripts = readMSSQLScripts;
exports.readAPIManagerPostgresSQLScripts = readAPIManagerPostgresSQLScripts;
exports.readAPIManagerMySQLScripts = readAPIManagerMySQLScripts;
exports.readAPIManagerMSSQLScripts = readAPIManagerMSSQLScripts;
