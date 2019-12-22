'use strict';

const __path = require('path');
const fs = require('fs');
const XMLJS = require('libxmljs');
const prettify = require('prettify-xml');

const constants = require('../../utils/constants');
const { logger } = require('../../utils/util.winston');
const { parseXML } = require('../../utils/util.parser');
const { constructRegistry } = require('./utils/util.registry');

/**
 * method to alter and construct registry configurations
 *
 * @param {*} workingDir path of the working directory
 * @param {*} registryConfs registry mount configuration arguments
 * @param {number} offset port offset
 */
async function alterRegistry(workingDir, registryConfs, offset) {
	logger.debug('Starting to alter registry');

	try {
		await parseXML(__path.join(workingDir, constants.path.registry)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let registryElems = constructRegistry(XMLJS.Element, doc, registryConfs, offset);

			parsed
				.root()
				.get('//*[local-name()="dbConfig"][@name="wso2registry"]')
				.addNextSibling(registryElems.shift());
			parsed
				.root()
				.get('//*[local-name()="dbConfig"][2]')
				.addNextSibling(registryElems.shift());
			parsed
				.root()
				.get('//*[local-name()="remoteInstance"]')
				.addNextSibling(registryElems.shift());
			parsed
				.root()
				.get('//*[local-name()="mount"]')
				.addNextSibling(registryElems.shift());

			let altered = parsed.toString();
			altered = altered.replace('encoding="UTF-8"', 'encoding="ISO-8859-1"');

			let _altered =
				altered.substring(0, altered.indexOf('<dbConfig name="govregistry">')) +
				`${constants.newLine}<!-- ${constants.comment}registry mounted -->\n` +
				altered.substring(altered.indexOf('<dbConfig name="govregistry">'));

			fs.writeFileSync(
				__path.join(workingDir, constants.path.registry),
				prettify(_altered, { indent: 4 }) + '\n',
				constants.utf8
			);
		});
	} catch (err) {
		logger.error(err);
	}
}

exports.alterRegistry = alterRegistry;
