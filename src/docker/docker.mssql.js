'use strict';

const Docker = require('dockerode');
const Client = require('mssql');
const ora = require('ora');

const HydrogenConfigMaps = require('../maps/map.hydrogen');
const mssqlDockerConstants = require('./configs/config.mssql');
const { logger } = require('../utils/util.winston');
const { generateRandomAnimalName, containerNameExists } = require('../utils/util');
const { readMSSQLScripts, readAPIManagerMSSQLScripts } = require('../utils/util.scripts');

/**
 * method to create a docker container for the mssql datasources
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {{}} options command options
 * @param {string} [workingDir=process.cwd()] path of the working directory
 */
async function createMSSQLDockerContainer(platform, options, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to create Docker container for MSSQL');

	const spinner = ora('Starting to create Docker container for MSSQL').start();
	let instance = new Docker();
	let chance = generateRandomAnimalName();
	chance = containerNameExists(instance, chance);

	instance.pull(`${mssqlDockerConstants.mssql.image}:${mssqlDockerConstants.mssql.tag}`, (err, stream) => {
		if (!err) instance.modem.followProgress(stream, onFinished, onProgress);
		else return logger.error(err);

		function onFinished(err) {
			if (!err) {
				spinner.text = 'Pulling Done... Now Creating Container';
				instance
					.createContainer({
						Image: mssqlDockerConstants.mssql.image + ':' + mssqlDockerConstants.mssql.tag,
						name: chance,
						Env: mssqlDockerConstants.mssql.envs,
						ExposedPorts: mssqlDockerConstants.mssql.ports,
						HostConfig: mssqlDockerConstants.mssql.host,
					})
					.then((container) => {
						if (process.env.HYDROGEN_DEBUG) logger.debug('Created MSSQL Docker container : ' + chance);
						spinner.succeed('Created MSSQL Docker Container : ' + chance);

						container.start().then(() => {
							if (options.generate) {
								if (options.setup) executeAPIManagerMSSQLScripts(options, workingDir);
								else executeMSSQLScripts(platform, workingDir);
							}
						});
					});
			} else {
				spinner.stop();
				return logger.error(err);
			}
		}
		function onProgress() {
			// logger.debug(`Pulling MSSQL Docker Image`);
			spinner.text = 'Pulling MSSQL Docker Image';
		}
	});
}

/**
 * method to execute mssql sql scripts to replace datasources
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {string} [workingDir=process.cwd()] path of the working directory
 */
async function executeMSSQLScripts(platform, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to execute MSSQL scripts for datasource');

	let config = mssqlDockerConstants.default;
	let combinedSQLScript = await readMSSQLScripts(platform, workingDir);

	setTimeout(() => {
		if (platform === HydrogenConfigMaps.platform.apim) {
			if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to create databases for API Manager');
			const spinner = ora('Creating DBs for API Manager').start();

			Client.connect(config, (err) => {
				if (err) {
					spinner.stop();
					return logger.error(err);
				}
				new Client.Request().query('create database ' + HydrogenConfigMaps.docker.apim.single + ';', (err) => {
					if (err) {
						spinner.stop();
						return logger.error(err);
					}

					Client.close();
					config.database = HydrogenConfigMaps.docker.apim.single;
					Client.connect(config, (err) => {
						if (err) {
							spinner.stop();
							return logger.error(err);
						}
						new Client.Request().query(combinedSQLScript, (err) => {
							if (err) {
								spinner.stop();
								return logger.error(err);
							}
							spinner.succeed('Created');
							Client.close();
						});
					});
				});
			});
		}
		if (platform === HydrogenConfigMaps.platform.is) {
			if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to create database for Identity Server');
			const spinner = ora('Creating DBs for Identity Server').start();

			Client.connect(config, (err) => {
				if (err) {
					spinner.stop();
					return logger.error(err);
				}
				new Client.Request().query(
					'create database ' + HydrogenConfigMaps.docker.is.single.mssql + ';',
					(err) => {
						if (err) {
							spinner.stop();
							return logger.error(err);
						}

						Client.close();
						config.database = HydrogenConfigMaps.docker.is.single.mssql;
						Client.connect(config, (err) => {
							if (err) {
								spinner.stop();
								return logger.error(err);
							}
							new Client.Request().query(combinedSQLScript, (err) => {
								if (err) {
									spinner.stop();
									return logger.error(err);
								}
								spinner.succeed('Created');
								Client.close();
							});
						});
					}
				);
			});
		}
	}, HydrogenConfigMaps.docker.timeout.mssql);
}

/**
 * method to execute mssql sql scripts for api manager datasources
 *
 * @param {{}} options command options
 * @param {string} [workingDir=process.cwd()] path of the working directory
 */
async function executeAPIManagerMSSQLScripts(options, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to execute MSSQL scripts for API Manager datasources');

	setTimeout(() => {
		loopAPIManagerDatasources(options, 0, workingDir);
	}, HydrogenConfigMaps.docker.timeout.mssql);
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

	let config = mssqlDockerConstants.default;
	let datasourceLength = HydrogenConfigMaps.docker.apim.setup.length;

	if (loopCount < datasourceLength) {
		if (process.env.HYDROGEN_DEBUG)
			logger.debug(
				'Starting to create ' + HydrogenConfigMaps.docker.apim.setup[loopCount] + ' database for API Manager'
			);
		const spinner = ora('Creating ' + HydrogenConfigMaps.docker.apim.setup[loopCount]).start();

		let combinedSQLScript = await readAPIManagerMSSQLScripts(options, workingDir);
		Client.connect(config, (err) => {
			if (err) {
				spinner.stop();
				return logger.error(err);
			}
			new Client.Request().query(
				'create database ' + HydrogenConfigMaps.docker.apim.setup[loopCount] + ';',
				(err) => {
					if (err) {
						spinner.stop();
						return logger.error(err);
					}

					Client.close();
					config.database = HydrogenConfigMaps.docker.apim.setup[loopCount];
					Client.connect(config, (err) => {
						if (err) {
							spinner.stop();
							return logger.error(err);
						}
						new Client.Request().query(
							combinedSQLScript[HydrogenConfigMaps.docker.apim.setup[loopCount]],
							(err) => {
								if (err) {
									spinner.stop();
									return logger.error(err);
								}

								spinner.succeed();
								Client.close();
								loopAPIManagerDatasources(options, ++loopCount, workingDir);
							}
						);
					});
				}
			);
		});
	}
}

exports.createMSSQLDockerContainer = createMSSQLDockerContainer;
