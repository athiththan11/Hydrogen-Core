'use strict';

const Chance = require('chance');

/**
 * method to generate random animal names
 *
 * @returns {string} an animal name
 */
function generateRandomAnimalName() {
	return new Chance().animal().replace(/[^a-zA-Z]/g, '');
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
