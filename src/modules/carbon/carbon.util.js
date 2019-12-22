'use strict';

const __path = require('path');
const fs = require('fs');
const XMLJS = require('libxmljs');

const constants = require('../../utils/constants');
const { logger } = require('../../utils/util.winston');
const { parseXML, alterElem } = require('../../utils/util.parser');

/**
 * method to configure port-offset in carbon
 *
 * @param {*} workingDir path of the working directory
 * @param {number} offset offset value as integer
 */
async function configPortOffset(workingDir, offset) {
    logger.debug('Starting to configure port-offset in carbon with offset ' + offset);
	if (offset > 0) {
		try {
			await parseXML(__path.join(workingDir, constants.path.carbon)).then((parsed) => {
				let doc = new XMLJS.Document(parsed);
				let offSetElem = new XMLJS.Element(doc, 'Offset', offset.toString());
				parsed
					.root()
					.get('//*[local-name()="Ports"]/*[local-name()="Offset"]')
					.addNextSibling(offSetElem);

				let _altered = parsed.toString().replace('encoding="UTF-8"', 'encoding="ISO-8859-1"');
				_altered = alterElem(_altered, 'Offset', `port offset ${offset}`);

				fs.writeFileSync(__path.join(workingDir, constants.path.carbon), _altered, constants.utf8);
			});
		} catch (err) {
			logger.error(err);
		}
	}
}

exports.configPortOffset = configPortOffset;
