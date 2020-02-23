'use strict';

const __path = require('path');
const fs = require('fs-extra');

const constants = require('../../utils/constants');
const HydrogenConfigMaps = require('../../maps/map.hydrogen');
const { logger } = require('../../utils/util.winston');

/**
 * method to alter and construct jndi.properties
 *
 * @param {{}} args configuration properties
 * @param {string} workingDir path of the working directory
 * @param {number} tmOffset traffic manager offset if any
 */
async function alterJNDIProperties(args, workingDir = process.cwd(), tmOffset = 0) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter jndi.properties');

	try {
		fs.readFile(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.jndiProperties), constants.utf8).then(
			(parsed) => {
				let altered = parsed;

				let _altered =
					altered.substring(0, altered.indexOf('connectionfactory.TopicConnectionFactory')) +
					'# ' +
					altered.substring(
						altered.indexOf('connectionfactory.TopicConnectionFactory'),
						altered.indexOf('connectionfactory.QueueConnectionFactory')
					) +
					`# ${constants.comment}
connectionfactory.TopicConnectionFactory = amqp://admin:admin@clientid/carbon?brokerlist='${
						args._tcpHostname
					}:${HydrogenConfigMaps.ports._5672 + tmOffset}'
` +
					altered.substring(altered.indexOf('connectionfactory.QueueConnectionFactory'));

				fs.writeFileSync(
					__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.jndiProperties),
					_altered,
					constants.utf8
				);
			}
		);
	} catch (err) {
		logger.error(err);
	}
}

exports.alterJNDIProperties = alterJNDIProperties;
