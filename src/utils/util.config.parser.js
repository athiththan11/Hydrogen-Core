'use strict';

const fs = require('fs');
const Ajv = require('ajv');

const { logger } = require('./util.winston');

/**
 * method to read and parse confgurations
 *
 * @param {string} configPath config file path
 * @returns {{}} parsed configuration string
 */
async function configParser(configPath) {
	try {
		let parsed = fs.readFileSync(configPath, 'utf8');
		parsed = JSON.parse(parsed);
		return parsed;
	} catch (err) {
		logger.error(err);
		return null;
	}
}

/**
 * method to validate the JSON schema and configurations
 *
 * @param {{}} schema schema
 * @param {{}} confs configurations
 * @returns {{valid: boolean, message: string}}
 */
async function validateConfigs(schema, confs) {
	let ajv = new Ajv();
	let valid = false,
		message = null;
	try {
		valid = ajv.validate(schema, confs);
	} catch (err) {
		message = (ajv.errors || [])
			.map((error) => {
				try {
					const [, index, fieldName] = /\[(.*)\].(.*)/.exec(error.dataPath);
					return `error with item #${index}'s field "${fieldName}". The error is: ${error.message}`;
				} catch (error) {
					return error.message;
				}
			})
			.join('\n');
	}
	return { valid, message };
}

exports.configParser = configParser;
exports.validateConfigs = validateConfigs;
