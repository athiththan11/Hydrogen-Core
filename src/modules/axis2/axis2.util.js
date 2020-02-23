'use strict';

const __path = require('path');

const HydrogenConfigMaps = require('../../maps/map.hydrogen');
const { logger } = require('../../utils/util.winston');
const { commentElemUsingXMLPath } = require('../../utils/util.parser');

/**
 * method to comment ws transport sender in axis2
 *
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 */
async function commentWSTransportSender(workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to comment WS Transport Sender');

	try {
		let artifactPath = __path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.axis2);
		let xmlPath = HydrogenConfigMaps.xmlPaths.axis2.ws_transportsender;
		await commentElemUsingXMLPath(xmlPath, artifactPath);
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to comment wss transport sender in axis2
 *
 * @param {string} [workingDir=process.cwd()] path of the current working directory
 */
async function commentWSSTransportSender(workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to comment WSS Transport Sender');

	try {
		let artifactPath = __path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.axis2);
		let xmlPath = HydrogenConfigMaps.xmlPaths.axis2.wss_transportsender;
		await commentElemUsingXMLPath(xmlPath, artifactPath);
	} catch (err) {
		logger.error(err);
	}
}

exports.commentWSTransportSender = commentWSTransportSender;
exports.commentWSSTransportSender = commentWSSTransportSender;
