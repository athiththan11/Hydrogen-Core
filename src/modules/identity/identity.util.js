'use strict';

const __path = require('path');
const fs = require('fs');
const XMLJS = require('libxmljs');
const prettify = require('prettify-xml');

const constants = require('../../utils/constants');
const { logger } = require('../../utils/util.winston');
const { parseXML } = require('../../utils/util.parser');

/**
 * method to alter identity configurations
 *
 * @param {*} workingDir path of the working directory
 * @param {*} jndiName JNDI Datasource name
 */
async function alterIdentity(workingDir, jndiName) {
	logger.debug('Starting to alter identity');

	try {
		await parseXML(__path.join(workingDir, constants.path.identity)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let elem = `<Name>${jndiName}`;

			let nameElement = new XMLJS.Element(doc, 'Name', jndiName);
			parsed
				.root()
				.get('//*[local-name()="JDBCPersistenceManager"]/*[local-name()="DataSource"]/*[local-name()="Name"]')
				.replace(nameElement);
			let altered = parsed.toString();
			// replace utf encoding with latin1
			altered = altered.replace('encoding="UTF-8"', 'encoding="ISO-8859-1"');
			// extract generic config
			let _altered =
				altered.substring(0, altered.lastIndexOf(elem)) +
				`\n${constants.tabSpace}\t<!-- ${constants.comment} datasource added & changed jdbc/WSO2CarbonDB -->\n${constants.tabSpace}\t` +
				altered.substring(altered.lastIndexOf(elem));

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

exports.alterIdentity = alterIdentity;
