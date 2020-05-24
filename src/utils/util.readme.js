'use strict';

const fs = require('fs');
const path = require('path');

const HydrogenConfigMaps = require('../maps/map.hydrogen');
const { logger } = require('./util.winston');

/**
 * method to create and write a hydrogen readme in the working directory
 *
 * @param {string} data data to be written
 * @param {path} filePath hydrogen readme file path
 */
async function writeReadMe(data, filePath = process.cwd()) {
	try {
		await writeHeadings(path.join(filePath, HydrogenConfigMaps.readme.md));
		fs.appendFileSync(path.join(filePath, HydrogenConfigMaps.readme.md), data, 'utf8');
	} catch (err) {
		logger.error(err);
		return null;
	}
}

/**
 * method to write the H1 in hydrogen readme
 *
 * @param {path} filePath hydrogen readme path
 */
async function writeHeadings(filePath) {
	try {
		if (!fs.existsSync(filePath)) {
			fs.writeFileSync(filePath, HydrogenConfigMaps.readme.h1 + '\n', 'utf8');
		}
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to write deployment configurations in hydrogen readme
 *
 * @param {string} data data to be written
 */
async function writeDeploymentConfigurations(data) {
	let deployment = `\n## Deployment Configurations\n\n${data}\n\n`;
	await writeReadMe(deployment);
}

/**
 * method to write docker configurations in hydrogen readme
 *
 * @param {string} data data to be written
 */
async function writeDockerConfigurations(data) {
	let docker = `\n## Docker Configurations\n\n${data}\n\n`;
	await writeReadMe(docker);
}

exports.writeReadMe = writeReadMe;
exports.writeDeploymentConfigurations = writeDeploymentConfigurations;
exports.writeDockerConfigurations = writeDockerConfigurations;
