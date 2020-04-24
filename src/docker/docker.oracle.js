'use strict';

const Docker = require('dockerode');
const Client = require('oracledb');

const HydrogenConfigMaps = require('../maps/map.hydrogen');
const oracleDockerConstants = require('./configs/config.oracle');
const { logger } = require('../utils/util.winston');
const { generateRandomAnimalName } = require('../utils/util');
const { readOracleSQLScripts, readAPIManagerOracleSQLScripts } = require('../utils/util.scripts');

/**
 * method to create a docker container for the oracle datasources
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {{}} options command options
 * @param {string} [workingDir=process.cwd()] path of the working directory
 */
async function createOracleDockerContainer(platform, options, workinDir = process.cwd()) {
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
						container.start().then(() => {
							if (options.generate) {
								if (options.setup) executeAPIManagerOracleSQLScripts(options, workinDir);
								else executeOracleSQLScripts(platform, workinDir);
							}
						});
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

	// TODO: oracle connection config check the format
	let config = oracleDockerConstants.default;
	let combinedSQLScript = await readOracleSQLScripts(platform, workinDir);
	setTimeout(() => {
		if (platform === HydrogenConfigMaps.platform.apim) {
			if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to create databases for API Manager');
			// TODO: oracle db creation
			Client.getConnection(config)
				.then((connection) => {
					connection.execute(combinedSQLScript, [], (err) => {
                        if (err) return logger.error(err);
                        connection.release();
					});
				})
				.catch((err) => {
					logger.error(err);
				});
		}
		if (platform === HydrogenConfigMaps.platform.is) {
			if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to create databases for Identity Server');
			// TODO: oracle db creation
		}
	}, HydrogenConfigMaps.docker.timeout.oracle);
}

/**
 * method to execute oracle sql scripts for api manager datasources
 *
 * @param {{}} options command options
 * @param {string} [workingDir=process.cwd()] path of the working directory
 */
async function executeAPIManagerOracleSQLScripts(options, workinDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to execute Oracle scripts for API Manager datasources');

	setTimeout(() => {
		loopAPIManagerDatasources(options, 0, workinDir);
	}, HydrogenConfigMaps.docker.timeout.oracle);
}

async function loopAPIManagerDatasources(options, loopCount, workinDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Looping through API Manager datasources');

	let config = oracleDockerConstants.default;
	let datasourceLength = HydrogenConfigMaps.docker.apim.setup.length;
	if (loopCount < datasourceLength) {
		if (process.env.HYDROGEN_DEBUG)
			logger.debug(
				'Starting to create ' + HydrogenConfigMaps.docker.apim.setup[loopCount] + ' database for API Manager'
			);
		let combinedSQLScript = await readAPIManagerOracleSQLScripts(options, workinDir);
		// TODO: create oracle database
	}
}

exports.createOracleDockerContainer = createOracleDockerContainer;
