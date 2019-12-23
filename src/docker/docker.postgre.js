'use strict';

const Docker = require('dockerode');
const { Client } = require('pg');
const { createdb } = require('pgtools');

const HydrogenConfigMaps = require('../maps/map.hydrogen');
const postgreDockerConstants = require('./configs/config.postgre');
const { logger } = require('../utils/util.winston');
const { generateRandomAnimalName } = require('../utils/util');
const { readPostgreSQLScripts, readAPIManagerPostgresSQLScripts } = require('../utils/util.scripts');

/**
 * method to create a docker container for the postgre datasources
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {*} options command options
 * @param {*} [workingDir=process.cwd()] path of the working directory
 */
async function createPostgreDockerContainer(platform, options, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to create Docker container for Postgre');

	let instance = new Docker();
	let chance = generateRandomAnimalName();
	instance.pull(`${postgreDockerConstants.postgre.image}:${postgreDockerConstants.postgre.tag}`, (err, stream) => {
		if (!err) instance.modem.followProgress(stream, onFinished, onProgress);
		else return logger.error(err);

		function onFinished(err) {
			if (!err) {
				instance
					.createContainer({
						Image: postgreDockerConstants.postgre.image + ':' + postgreDockerConstants.postgre.tag,
						name: chance,
						Env: postgreDockerConstants.postgre.envs,
						ExposedPorts: postgreDockerConstants.postgre.ports,
						HostConfig: postgreDockerConstants.postgre.host,
					})
					.then((container) => {
						logger.info('Created Postgre Docker container : ' + chance);
						container.start().then(() => {
							if (options.generate) {
								if (options.setup) executeAPIManagerPostgreSQLScripts(options, workingDir);
								else executePostgreSQLScripts(platform, workingDir);
							}
						});
					});
			} else return logger.error(err);
		}

		function onProgress() {
			logger.info(`Pulling Postgre Docker Image`);
		}
	});
}

/**
 * method to execute postgre sql scripts to replace datasources
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {*} [workingDir=process.cwd()] path of the working directory
 */
async function executePostgreSQLScripts(platform, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to execute Postgre scripts for datasource');

	let config = postgreDockerConstants.default;
	let combinedSQLScript = readPostgreSQLScripts(platform, workingDir);
	setTimeout(() => {
		if (platform === HydrogenConfigMaps.platform.apim) {
			createdb(config, HydrogenConfigMaps.docker.apim.single)
				.then(() => {
					config.database = HydrogenConfigMaps.docker.apim.single;
					const client = new Client(config);
					client.connect();
					client.query(combinedSQLScript, (err) => {
						if (err) return logger.error(err);
						client.end();
					});
				})
				.catch((err) => {
					return logger.error(err);
				});
		}
		if (platform === HydrogenConfigMaps.platform.is) {
			createdb(config, HydrogenConfigMaps.docker.is.single.postgre)
				.then(() => {
					config.database = HydrogenConfigMaps.docker.is.single.postgre;
					const client = new Client(config);
					client.connect();
					client.query(combinedSQLScript, (err) => {
						if (err) return logger.error(err);
						client.end();
					});
				})
				.catch((err) => {
					return logger.error(err);
				});
		}
	}, HydrogenConfigMaps.docker.timeout.postgre);
}

/**
 * method to execute postgre sql scripts for api manager datasources
 *
 * @param {*} options command options
 * @param {*} [workingDir=process.cwd()] path of the working directory
 */
async function executeAPIManagerPostgreSQLScripts(options, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to execute Postgre scripts for API Manager datasources');

	setTimeout(() => {
		loopAPIManagerDatasources(options, 0, workingDir);
	}, HydrogenConfigMaps.docker.timeout.postgre);
}

/**
 * method to loop through api manager datasources [am, um, reg] to execute sql scripts
 *
 * @param {*} options command options
 * @param {number} loopCount loop count
 * @param {*} [workingDir=process.cwd()] path of the working directory
 */
async function loopAPIManagerDatasources(options, loopCount, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Looping through API Manager datasources');

	let config = postgreDockerConstants.default;
	let datasourceLength = HydrogenConfigMaps.docker.apim.setup.length;
	if (loopCount < datasourceLength) {
		let combinedSQLScript = await readAPIManagerPostgresSQLScripts(options, workingDir);
		createdb(config, HydrogenConfigMaps.docker.apim.setup[loopCount])
			.then(() => {
				config.database = HydrogenConfigMaps.docker.apim.setup[loopCount];
				const client = new Client(config);
				client.connect();
				client.query(combinedSQLScript[HydrogenConfigMaps.docker.apim.setup[loopCount]], (err) => {
					if (err) return logger.error(err);
					client.end();
				});
			})
			.catch((err) => {
				return logger.error(err);
			});
		await loopAPIManagerDatasources(options, ++loopCount, workingDir);
	}
}

exports.createPostgreDockerContainer = createPostgreDockerContainer;
