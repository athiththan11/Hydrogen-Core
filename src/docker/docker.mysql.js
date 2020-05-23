'use strict';

const Docker = require('dockerode');
const Client = require('mysql');
const ora = require('ora');

const HydrogenConfigMaps = require('../maps/map.hydrogen');
const mysqlDockerConstants = require('./configs/config.mysql');
const { logger } = require('../utils/util.winston');
const { generateRandomAnimalName, containerNameExists } = require('../utils/util');
const { readMySQLScripts, readAPIManagerMySQLScripts } = require('../utils/util.scripts');

/**
 * method to create a docker container for the mysql datasources
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {{}} options command options { options: { generate: true, setup: true }}
 * @param {string} [workingDir=process.cwd()] path of the working directory
 */
async function createMySQLDockerContainer(platform, options, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to create Docker container for MySQL');

	const spinner = ora('Starting to create Docker container for MySQL').start();
	let instance = new Docker();
	let chance = generateRandomAnimalName();
	chance = containerNameExists(instance, chance);

	instance.pull(`${mysqlDockerConstants.mysql.image}:${mysqlDockerConstants.mysql.tag}`, (err, stream) => {
		if (!err) instance.modem.followProgress(stream, onFinished, onProgress);
		else return logger.error(err);

		function onFinished(err) {
			if (!err) {
				spinner.text = 'Pulling Done... Now Creating Container';
				instance
					.createContainer({
						Image: mysqlDockerConstants.mysql.image + ':' + mysqlDockerConstants.mysql.tag,
						name: chance,
						Env: mysqlDockerConstants.mysql.envs,
						ExposedPorts: mysqlDockerConstants.mysql.ports,
						HostConfig: mysqlDockerConstants.mysql.host,
						Cmd: mysqlDockerConstants.mysql.cmd,
					})
					.then((container) => {
						if (process.env.HYDROGEN_DEBUG) logger.debug('Created MySQL Docker container : ' + chance);
						spinner.succeed('Created MySQL Docker container : ' + chance);

						container.start().then(() => {
							if (options.generate) {
								if (options.setup) executeAPIManagerMySQLScripts(options, workingDir);
								else executeMySQLScripts(platform, workingDir);
							}
						});
					});
			} else {
				spinner.stop();
				return logger.error(err);
			}
		}
		function onProgress() {
			// logger.debug(`Pulling MySQL Docker Image`);
			spinner.text = 'Pulling MySQL Docker Image';
		}
	});
}

/**
 * method to execute mysql sql scripts to replace datasources
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {string} [workingDir=process.cwd()] path of the working directory
 */
async function executeMySQLScripts(platform, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to execute MySQL scripts for datasource');

	let config = mysqlDockerConstants.default;
	let combinedSQLScript = await readMySQLScripts(platform, workingDir);

	setTimeout(() => {
		let client = Client.createConnection(config);
		if (platform === HydrogenConfigMaps.platform.apim) {
			if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to create databases for API Manager');
			const spinner = ora('Creating DBs for API Manager').start();

			client.connect((err) => {
				if (err) {
					spinner.stop();
					return logger.error(err);
				}
				client.query(
					'create database ' +
						HydrogenConfigMaps.docker.apim.single +
						' charset latin1 collate latin1_swedish_ci',
					(err) => {
						if (err) {
							spinner.stop();
							return logger.error(err);
						}
						config.database = HydrogenConfigMaps.docker.apim.single;
						const newClient = Client.createConnection(config);
						newClient.query(combinedSQLScript, (err) => {
							if (err) {
								spinner.stop();
								return logger.error(err);
							}
							spinner.succeed('Created');

							newClient.end();
							client.end();
						});
					}
				);
				client.query(
					`grant all on ` +
						HydrogenConfigMaps.docker.apim.single +
						`.* to '${'mysql'}'@'%'; FLUSH PRIVILEGES;`
				);
			});
		}
		if (platform === HydrogenConfigMaps.platform.is) {
			if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to create databases for Identity Server');
			const spinner = ora('Creating DBs for Identity Server').start();

			client.connect((err) => {
				if (err) {
					spinner.stop();
					return logger.error(err);
				}
				client.query(
					'create database ' +
						HydrogenConfigMaps.docker.is.single.mysql +
						' charset latin1 collate latin1_swedish_ci',
					(err) => {
						if (err) {
							spinner.stop();
							return logger.error(err);
						}
						config.database = HydrogenConfigMaps.docker.is.single.mysql;
						const newClient = Client.createConnection(config);
						newClient.query(combinedSQLScript, (err) => {
							if (err) {
								spinner.stop();
								return logger.error(err);
							}
							spinner.succeed('Created');

							newClient.end();
							client.end();
						});
					}
				);
				client.query(
					`grant all on ` +
						HydrogenConfigMaps.docker.is.single.mysql +
						`.* to '${'mysql'}'@'%'; FLUSH PRIVILEGES;`,
					(err) => {
						if (err) return logger.error(err);
					}
				);
			});
		}
	}, HydrogenConfigMaps.docker.timeout.mysql);
}

/**
 * method to execute mysql sql scripts for api manager datasources
 *
 * @param {{}} options command options
 * @param {string} [workingDir=process.cwd()] path of the working directory
 */
async function executeAPIManagerMySQLScripts(options, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to execute MySQL scripts for API Manager datasources');

	setTimeout(() => {
		loopAPIManagerDatasources(options, 0, workingDir);
	}, HydrogenConfigMaps.docker.timeout.mysql);
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

	let config = mysqlDockerConstants.default;
	let datasourceLength = HydrogenConfigMaps.docker.apim.setup.length;

	if (loopCount < datasourceLength) {
		if (process.env.HYDROGEN_DEBUG)
			logger.debug(
				'Starting to create ' + HydrogenConfigMaps.docker.apim.setup[loopCount] + ' database for API Manager'
			);
		const spinner = ora('Creating ' + HydrogenConfigMaps.docker.apim.setup[loopCount]).start();

		let combinedSQLScript = await readAPIManagerMySQLScripts(options, workingDir);
		let client = Client.createConnection(config);
		client.connect((err) => {
			if (err) {
				spinner.stop();
				return logger.error(err);
			}
			client.query(
				`create database ` +
					HydrogenConfigMaps.docker.apim.setup[loopCount] +
					` charset latin1 collate latin1_swedish_ci;`,
				(err) => {
					if (err) {
						spinner.stop();
						return logger.error(err);
					}
					config.database = HydrogenConfigMaps.docker.apim.setup[loopCount];
					const subclient = Client.createConnection(config);
					subclient.query(combinedSQLScript[HydrogenConfigMaps.docker.apim.setup[loopCount]], (err) => {
						if (err) {
							spinner.stop();
							return logger.error(err);
						}
						spinner.succeed();

						subclient.end();
						client.end();
					});
				}
			);

			client.query(
				`grant all on ` +
					HydrogenConfigMaps.docker.apim.setup[loopCount] +
					`.* to '${'mysql'}'@'%'; FLUSH PRIVILEGES;`,
				(err) => {
					if (err) return logger.error(err);
					loopAPIManagerDatasources(options, ++loopCount, workingDir);
				}
			);
		});
	}
}

exports.createMySQLDockerContainer = createMySQLDockerContainer;
