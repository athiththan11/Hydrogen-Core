'use strict';

const __path = require('path');
const fs = require('fs');
const XMLJS = require('libxmljs');
const prettify = require('prettify-xml');

const constants = require('../../utils/constants');
const HydrogenConfigMaps = require('../../maps/map.hydrogen');
const { logger } = require('../../utils/util.winston');
const { parseXML } = require('../../utils/util.parser');
const { constructRegistry } = require('./utils/util.registry');

/**
 * method to alter and construct registry configurations
 *
 * @param {{}} registryConfs registry mount configuration arguments
 * @param {number} offset port offset
 * @param {string} workingDir path of the working directory
 * @param {{ version: string }} options configuration parameters and arguments to identify versions
 */
async function alterRegistry(registryConfs, offset, workingDir = process.cwd(), options = { version: '2.6' }) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter registry');

    try {
        // apim 2.6 block
		if (options.version === HydrogenConfigMaps.supportedVersions.apim.v26)
			await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.registry)).then((parsed) => {
				let doc = new XMLJS.Document(parsed);
				let registryElems = constructRegistry(XMLJS.Element, doc, registryConfs, offset);

				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.registry.dbconfig_wso2registry)
					.addNextSibling(registryElems.shift());
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.registry.dbconfig + '[2]')
					.addNextSibling(registryElems.shift());
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.registry.remoteinstance)
					.addNextSibling(registryElems.shift());
				parsed.root().get(HydrogenConfigMaps.xmlPaths.registry.mount).addNextSibling(registryElems.shift());

				let altered = parsed.toString();
				altered = altered.replace(HydrogenConfigMaps.encodings.utf8, HydrogenConfigMaps.encodings.iso_8859_1);

				let _altered =
					altered.substring(0, altered.indexOf('<dbConfig name="govregistry">')) +
					`${constants.newLine}<!-- ${constants.comment}registry mounted -->\n` +
					altered.substring(altered.indexOf('<dbConfig name="govregistry">'));

				fs.writeFileSync(
					__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.registry),
					prettify(_altered, { indent: 4 }) + '\n',
					constants.utf8
				);
			});
	} catch (err) {
		logger.error(err);
	}
}

exports.alterRegistry = alterRegistry;
