'use strict';

const Chance = require('chance');

/**
 * method to generate random animal names
 *
 * @returns an animal name
 */
function generateRandomAnimalName() {
	return new Chance().animal().replace(/[^a-zA-Z]/g, '');
}

exports.generateRandomAnimalName = generateRandomAnimalName;
