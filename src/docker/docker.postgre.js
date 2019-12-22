'use strict';

const Docker = require('dockerode');
const Chance = require('chance');
const { Client } = require('pg');
const { createdb } = require('pgtools');

const postgreDockerConstants = require('./configs/config.postgre');
const { logger } = require('../utils/util.winston');
const { readPostgreSQLScripts } = require('../utils/util.scripts');

async function createPostgreDockerContainer(platform, workingDir, options) {
	logger.debug('Starting to create Docker container for Postgre');

	let instance = new Docker();
	let chance = new Chance().animal().replace(/[^a-zA-Z]/g, '');
	instance.pull(`${postgreDockerConstants.postgre.image}:${postgreDockerConstants.postgre.tag}`, (err, stream) => {
		if (!err) instance.modem.followProgress(stream, onFinished, onProgress);
		else logger.error(err);

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
								if (options.command === 'setup') executeSetupPostgresScripts(product, paths, opts); // FIXME:
								else executePostgreSQLScripts(platform, workingDir);
							}
						});
					});
			} else logger.error(err);
		}

		function onProgress() {
			logger.info(`Pulling Postgre Docker Image`);
		}
	});
}

async function executePostgreSQLScripts(platform, workingDir) {
	let config = postgreDockerConstants.default;
	let combinedSQLScript = readPostgreSQLScripts(platform, workingDir);
	setTimeout(() => {
		if (platform === 'apim') {
			createdb(config, 'wso2amdb')
				.then(() => {
					config.database = 'wso2amdb';
					const client = new Client(config);
					client.connect();
					client.query(combinedSQLScript, (err) => {
						if (err) logger.error(err);
						client.end();
					});
				})
				.catch((err) => {
					logger.error(err);
				});
		}
		if (platform === 'is') {
			createdb(config, 'wso2postgre')
				.then(() => {
					config.database = 'wso2postgre';
					const client = new Client(config);
					client.connect();
					client.query(combinedSQLScript, (err) => {
						if (err) logger.error(err);
						client.end();
					});
				})
				.catch((err) => {
					logger.error(err);
				});
		}
	}, 5000);
}

exports.createPostgreDockerContainer = createPostgreDockerContainer;
