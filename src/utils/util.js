'use strict';

const Chance = require('chance');

/**
 * method to generate random animal names
 *
 * @returns {string} an animal name
 */
function generateRandomAnimalName() {
	return new Chance()
		.animal()
		.replace(/[^a-zA-Z]/g, '')
		.toLowerCase();
}

/**
 * method to check if any containers existing with the same name
 *
 * @param {Dockerode} docker docker instance
 * @param {string} name container name
 */
function containerNameExists(docker, name) {
	let chance = name;
	docker.listContainers({ name: chance }, (err, containers) => {
		if (containers.length > 0) {
			chance = generateRandomAnimalName();
			containerNameExists(docker, chance);
		} else name = chance;
	});
	return chance;
}

/**
 * method to prepare oracle SQL Scripts for the node-oracledb to execute
 *
 * @param {string} script oracle sql script
 * @returns {[string]} array of sql scripts
 */
function prepareOracleSQLScripts(script) {
	return script
		.split('\n')
		.filter(Boolean) // remove empty lines
		.filter((l) => !l.startsWith('--')) // remove commented lines
		.join('\n')
		.split('/')
		.filter(Boolean)
		.filter((l) => l.trim()); // trim lines
}

exports.generateRandomAnimalName = generateRandomAnimalName;
exports.prepareOracleSQLScripts = prepareOracleSQLScripts;
exports.containerNameExists = containerNameExists;
