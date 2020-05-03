'use strict';

const __path = require('path');
const fs = require('fs');

const { prepareOracleSQLScripts } = require('../utils/util');
const HydrogenConfigMaps = require('../maps/map.hydrogen');

/**
 * method to read and return postgre sql scripts
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {string} workingDir path of the working directory
 * @returns {string} combined SQL script
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
 * @param {string} workingDir path of the working directory
 * @returns {string} combined SQL script
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
 * @param {string} workingDir path of the working directory
 * @returns {string} combined SQL script
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
 * @param {{}} options command options
 * @param {string} [workingDir=process.cwd()] path of the working directory
 * @returns {{apimgtdb: string, userdb: string, regdb: string}} a collection of scripts for am, um & reg dbs
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
		let apimPack = fs.readdirSync(workingDir).filter((name) => {
			return name.startsWith(HydrogenConfigMaps.servers.apim);
		})[0];
		if (apimPack) {
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
 * @param {{}} options command options
 * @param {string} [workingDir=process.cwd()] path of the working directory
 * @returns {{apimgtdb: string, userdb: string, regdb: string}} a collection of scripts for am, um & reg dbs
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
		let apimPack = fs.readdirSync(workingDir).filter((name) => {
			return name.startsWith(HydrogenConfigMaps.servers.apim);
		})[0];
		if (apimPack) {
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
 * @param {{}} options command options
 * @param {string} [workingDir=process.cwd()] path of the working directory
 * @returns {{apimgtdb: string, userdb: string, regdb: string}} a collection of scripts for am, um & reg dbs
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
		let apimPack = fs.readdirSync(workingDir).filter((name) => {
			return name.startsWith(HydrogenConfigMaps.servers.apim);
		})[0];
		if (apimPack) {
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
// TESTME:
/**
 * method to read and return oracle sql scripts
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {string} [workingDir=process.cwd()] path of the working directory
 * @returns {[string]} combined SQL script
 */
async function readOracleSQLScripts(platform, workingDir = process.cwd()) {
	let scripts = [];

	if (platform === HydrogenConfigMaps.platform.is) {
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.is.dbscripts,
						HydrogenConfigMaps.datasource.scripts.oracle
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
						HydrogenConfigMaps.datasource.scripts.oracle
					)
				)
				.toString()
		);
		// * storedprocedure doesn't contain oracle script
		// scripts.push(
		// 	fs
		// 		.readFileSync(
		// 			__path.join(
		// 				workingDir,
		// 				HydrogenConfigMaps.artifactPaths.scripts.is.storedProcedure,
		// 				HydrogenConfigMaps.datasource.oracle,
		// 				HydrogenConfigMaps.datasource.scripts.oracle
		// 			)
		// 		)
		// 		.toString()
		// );
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.is.uma,
						HydrogenConfigMaps.datasource.scripts.oracle
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
						HydrogenConfigMaps.datasource.scripts.oracle
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
						HydrogenConfigMaps.datasource.scripts.oracle
					)
				)
				.toString()
		);
	}

	return prepareOracleSQLScripts(scripts.join('\n'));
}

/**
 * method to read and return oracle sql scripts for api manager datasources including am, um, & reg db
 *
 * @param {{}} options command options
 * @param {string} [workingDir=process.cwd()] path of the working directory
 * @returns {{apimgtdb: [string], userdb: [string], regdb: [string]}} a collection of scripts for am, um & reg dbs
 */
async function readAPIManagerOracleSQLScripts(options, workingDir = process.cwd()) {
	let scripts = [];

	if (!options[HydrogenConfigMaps.platform.iskm] && !options.distributed) {
		scripts.push(
			fs
				.readFileSync(
					__path.join(
						workingDir,
						HydrogenConfigMaps.artifactPaths.scripts.apim.apimgt,
						HydrogenConfigMaps.datasource.scripts.oracle
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
						HydrogenConfigMaps.datasource.scripts.oracle
					)
				)
				.toString()
		);
	}

	if (options[HydrogenConfigMaps.platform.iskm] || options.distributed) {
		let apimPack = fs.readdirSync(workingDir).filter((name) => {
			return name.startsWith(HydrogenConfigMaps.servers.apim);
		})[0];
		if (apimPack) {
			scripts.push(
				fs
					.readFileSync(
						__path.join(
							workingDir,
							apimPack,
							HydrogenConfigMaps.artifactPaths.scripts.apim.apimgt,
							HydrogenConfigMaps.datasource.scripts.oracle
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
							HydrogenConfigMaps.datasource.scripts.oracle
						)
					)
					.toString()
			);
		}
	}

	// keywords are matched to be in hydrogen config maps > docker > apim.setup
	let scriptCollection = {
		apimgtdb: prepareOracleSQLScripts(scripts[0]),
		userdb: prepareOracleSQLScripts(scripts[1]),
		regdb: prepareOracleSQLScripts(scripts[1]),
	};
	return scriptCollection;
}

/**
 * method to generate create database queries for oracle
 *
 * @param {string} database database (user) name
 * @returns {[string]} required create user queries
 */
function generateCreateQueryforOracle(database) {
	let queries = [
		`create user ${database} identified by oracle account unlock`,
		`grant connect to ${database}`,
		`grant create session, create table, create sequence, create trigger, create procedure to ${database}`,
		`grant dba to ${database}`,
		`commit`,
	];
	return queries;
}

exports.readPostgreSQLScripts = readPostgreSQLScripts;
exports.readMySQLScripts = readMySQLScripts;
exports.readMSSQLScripts = readMSSQLScripts;
exports.readOracleSQLScripts = readOracleSQLScripts;
exports.readAPIManagerPostgresSQLScripts = readAPIManagerPostgresSQLScripts;
exports.readAPIManagerMySQLScripts = readAPIManagerMySQLScripts;
exports.readAPIManagerMSSQLScripts = readAPIManagerMSSQLScripts;
exports.readAPIManagerOracleSQLScripts = readAPIManagerOracleSQLScripts;
exports.generateCreateQueryforOracle = generateCreateQueryforOracle;
