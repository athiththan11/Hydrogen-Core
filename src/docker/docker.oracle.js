'use strict';

const Docker = require('dockerode');
const Client = require('oracledb');

const HydrogenConfigMaps = require('../maps/map.hydrogen');
const oracleDockerConstants = require('./configs/config.oracle');
const { logger } = require('../utils/util.winston');
const { generateRandomAnimalName } = require('../utils/util');
const {
	readOracleSQLScripts,
	readAPIManagerOracleSQLScripts,
	generateCreateQueryforOracle,
} = require('../utils/util.scripts');

/**
 * method to create a docker container for the oracle datasources
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {{}} options command options
 * @param {string} [workingDir=process.cwd()] path of the working directory
 */
async function createOracleDockerContainer(platform, options, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to create Docker container for Oracle');

	let instance = new Docker();
	let chance = generateRandomAnimalName();
	instance.pull(`${oracleDockerConstants.oracle.image}:${oracleDockerConstants.oracle.tag}`, (err, stream) => {
		if (!err) instance.modem.followProgress(stream, onFinished, onProgress);
		else return logger.error(err);

		function onFinished(err) {
			if (!err) {
				instance
					.createContainer({
						Image: oracleDockerConstants.oracle.image + ':' + oracleDockerConstants.oracle.tag,
						name: chance,
						Env: oracleDockerConstants.oracle.envs,
						ExposedPorts: oracleDockerConstants.oracle.ports,
						HostConfig: oracleDockerConstants.oracle.host,
					})
					.then((container) => {
						logger.info('Created Oracle Docker container : ' + chance);
						container.start();
						logger.info('Waiting for the container to initialize');
						setTimeout(() => {
							if (options.generate) {
								if (options.setup) executeAPIManagerOracleSQLScripts(options, workingDir);
								else executeOracleSQLScripts(platform, workingDir);
							}
						}, HydrogenConfigMaps.docker.timeout.oracle);
					})
					.catch((err) => {
						return logger.error(err);
					});
			} else return logger.error(err);
		}
		function onProgress() {
			logger.info(`Pulling Oracle Docker Image`);
		}
	});
}

/**
 * method to execute oracle sql scripts to replace datasources
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {string} [workingDir=process.cwd()] path of the working directory
 */
async function executeOracleSQLScripts(platform, workinDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to execute Oracle scripts for datasource');

	let config = oracleDockerConstants.default;
	let combinedSQLScript = await readOracleSQLScripts(platform, workinDir);
	if (platform === HydrogenConfigMaps.platform.apim) {
		if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to create databases for API Manager');
		Client.getConnection(config)
			.then((connection) => {
				if (process.env.HYDROGEN_DEBUG) logger.debug('Creating Users in Oracle Instance');

				let createQuery = generateCreateQueryforOracle(HydrogenConfigMaps.docker.apim.single);
				loopExecuteOracleQuery(connection, createQuery)
					.then(() => {
						config.user = HydrogenConfigMaps.docker.apim.single;
						config.password = 'oracle';
						Client.getConnection(config)
							.then((connection) => {
								loopExecuteOracleQuery(connection, combinedSQLScript);
							})
							.catch((err) => {
								return logger.error('Error while obtaining connection for ' + config.user + '\n', err);
							});
					})
					.catch((err) => {
						return logger.error(err);
					});
			})
			.catch((err) => {
				return logger.error('Error while obtaining initial connection\n', err);
			});
	}
	if (platform === HydrogenConfigMaps.platform.is) {
		if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to create databases for Identity Server');
		Client.getConnection(config)
			.then((connection) => {
				if (process.env.HYDROGEN_DEBUG) logger.debug('Creating Users in Oracle Instance');

				let createQuery = generateCreateQueryforOracle(HydrogenConfigMaps.docker.is.single.oracle);
				loopExecuteOracleQuery(connection, createQuery)
					.then(() => {
						config.user = HydrogenConfigMaps.docker.is.single.oracle;
						config.password = 'oracle';
						Client.getConnection(config)
							.then((connection) => {
								loopExecuteOracleQuery(connection, combinedSQLScript);
							})
							.catch((err) => {
								return logger.error('Error while obtaining connection for ' + config.user + '\n', err);
							});
					})
					.catch((err) => {
						return logger.error(err);
					});
			})
			.catch((err) => {
				return logger.error('Error while obtaining initial connection\n', err);
			});
	}
}

/**
 * method to loop through query array and to execute the oracle queries
 *
 * @description oracledb doesn't support bulk execution
 * @param {OracleDB.Connection} connection oracledb connection
 * @param {[string]} query oracle sql queries in array
 */
async function loopExecuteOracleQuery(connection, query) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to loop and execute Oracle scripts');

	for (var q of query) {
		// if (process.env.HYDROGEN_DEBUG) logger.debug('Executing ' + q);
		await connection.execute(q);
	}
	if (connection) {
		if (process.env.HYDROGEN_DEBUG) logger.debug('Closing the Oracle DB Connections');
		// await connection.commit();
		try {
			await connection.close();
		} catch (err) {
			return logger.error(err);
		}
	}
}

/**
 * method to execute oracle sql scripts for api manager datasources
 *
 * @param {{}} options command options
 * @param {string} [workingDir=process.cwd()] path of the working directory
 */
async function executeAPIManagerOracleSQLScripts(options, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to execute Oracle scripts for API Manager datasources');

	loopAPIManagerDatasources(options, 0, workingDir);
}

/**
 * method to loop through api manager datasources [am, um, reg] to execute sql scripts
 *
 * @param {{}} options command options
 * @param {number} loopCount loop count
 * @param {string} [workingDir=process.cwd()] path of the working directory
 */
async function loopAPIManagerDatasources(options, loopCount, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Looping through API Manager datasources');

	let config = oracleDockerConstants.default;
	let datasourceLength = HydrogenConfigMaps.docker.apim.setup.length;
	if (loopCount < datasourceLength) {
		if (process.env.HYDROGEN_DEBUG)
			logger.debug(
				'Starting to create ' + HydrogenConfigMaps.docker.apim.setup[loopCount] + ' database for API Manager'
			);
		let combinedSQLScript = await readAPIManagerOracleSQLScripts(options, workingDir);
		Client.getConnection(config)
			.then((connection) => {
				if (process.env.HYDROGEN_DEBUG)
					logger.debug('Creating ' + HydrogenConfigMaps.docker.apim.setup[loopCount] + ' in Oracle instance');

				let createQuery = generateCreateQueryforOracle(HydrogenConfigMaps.docker.apim.setup[loopCount]);
				loopExecuteOracleQuery(connection, createQuery);
				config.user = HydrogenConfigMaps.docker.apim.setup[loopCount];
				config.password = 'oracle';
				setTimeout(() => {
					Client.getConnection(config).then((connection) => {
						if (
							loopExecuteOracleQuery(
								connection,
								combinedSQLScript[HydrogenConfigMaps.docker.apim.setup[loopCount]]
							)
						) {
							if (process.env.HYDROGEN_DEBUG) logger.debug('Starting the next iteration');
							loopAPIManagerDatasources(options, ++loopCount, workingDir);
						}
					});
				}, 10000);
			})
			.catch((err) => {
				return logger.error(err);
			});
	}
}

exports.createOracleDockerContainer = createOracleDockerContainer;
