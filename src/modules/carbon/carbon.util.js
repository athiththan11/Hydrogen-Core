'use strict';

const __path = require('path');
const fs = require('fs');
const XMLJS = require('libxmljs');

const constants = require('../../utils/constants');
const HydrogenConfigMaps = require('../../maps/map.hydrogen');
const { logger } = require('../../utils/util.winston');
const { parseXML, alterElem } = require('../../utils/util.parser');

/**
 * method to configure port-offset in carbon
 *
 * @param {*} workingDir path of the working directory
 * @param {number} [offset=0] offset value as integer
 */
async function configurePortOffset(workingDir = process.cwd(), offset = 0) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to configure port-offset in carbon with offset ' + offset);

	if (offset > 0) {
		try {
			await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.carbon)).then((parsed) => {
				let doc = new XMLJS.Document(parsed);
				let offSetElem = new XMLJS.Element(doc, 'Offset', offset.toString());
				parsed
					.root()
					.get(HydrogenConfigMaps.xmlPaths.carbon.ports_offset)
					.addNextSibling(offSetElem);

				let _altered = parsed.toString().replace(HydrogenConfigMaps.encodings.utf8, HydrogenConfigMaps.encodings.iso_8859_1);
				_altered = alterElem(_altered, 'Offset', `port offset ${offset}`);

				fs.writeFileSync(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.carbon), _altered, constants.utf8);
			});
		} catch (err) {
			logger.error(err);
		}
	}
}

exports.configurePortOffset = configurePortOffset;
