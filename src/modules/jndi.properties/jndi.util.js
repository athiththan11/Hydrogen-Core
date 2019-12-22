'use strict';

const __path = require('path');
const fs = require('fs');

const constants = require('../../utils/constants');
const { logger } = require('../../utils/util.winston');

/**
 * method to alter and construct jndi.properties
 *
 * @param {*} workingDir path of the working directory
 * @param {number} tmOffset traffic manager offset if any
 */
async function alterJNDIProperties(workingDir = process.cwd(), tmOffset = 0) {
    if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter jndi.properties');
    
	try {
		await fs.readFile(__path.join(workingDir, constants.path.jndiProperties), constants.utf8).then((parsed) => {
			let altered = parsed;

			let _altered =
				altered.substring(0, altered.indexOf('connectionfactory.TopicConnectionFactory')) +
				'# ' +
				altered.substring(
					altered.indexOf('connectionfactory.TopicConnectionFactory'),
					altered.indexOf('connectionfactory.QueueConnectionFactory')
				) +
				`# ${constants.comment}
connectionfactory.TopicConnectionFactory = amqp://admin:admin@clientid/carbon?brokerlist='tcp://localhost:${constants
					.ports._5672 + tmOffset}'
` +
				altered.substring(altered.indexOf('connectionfactory.QueueConnectionFactory'));

			fs.writeFileSync(__path.join(workingDir, constants.path.jndiProperties), _altered, constants.utf8);
		});
	} catch (err) {
		logger.error(err);
	}
}

exports.alterJNDIProperties = alterJNDIProperties;
