'use strict';

const __path = require('path');
const fs = require('fs');
const XMLJS = require('libxmljs');
const prettify = require('prettify-xml');

const constants = require('../../utils/constants');
const HydrogenConfigMaps = require('../../maps/map.hydrogen');
const { logger } = require('../../utils/util.winston');
const { parseXML } = require('../../utils/util.parser');

/**
 * method to alter identity configurations
 *
 * @param {string} jndiName JNDI Datasource name
 * @param {*} workingDir path of the working directory
 */
async function alterIdentity(jndiName, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter identity');

	try {
		await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.identity)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let elem = `<Name>${jndiName}`;

			let nameElement = new XMLJS.Element(doc, 'Name', jndiName);
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.identity.jdbcpersistencemanager_datasource_name)
				.replace(nameElement);
			let altered = parsed.toString();
			// replace utf encoding with latin1
			altered = altered.replace(HydrogenConfigMaps.encodings.utf8, HydrogenConfigMaps.encodings.iso_8859_1);
			// extract generic config
			let _altered =
				altered.substring(0, altered.lastIndexOf(elem)) +
				`\n${constants.tabSpace}\t<!-- ${constants.comment} datasource added & changed jdbc/WSO2CarbonDB -->\n${constants.tabSpace}\t` +
				altered.substring(altered.lastIndexOf(elem));

			fs.writeFileSync(
				__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.identity),
				prettify(_altered, { indent: 4 }) + '\n',
				constants.utf8
			);
		});
	} catch (err) {
		logger.error(err);
	}
}

exports.alterIdentity = alterIdentity;
