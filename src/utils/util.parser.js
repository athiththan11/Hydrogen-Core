'use strict';

const fs = require('fs');
const XMLJS = require('libxmljs');

const constants = require('../utils/constants');
const { logger } = require('./util.winston');

/**
 * method to parse synapse xml
 *
 * @param {string} filePath synapse xml file path
 * @returns {Document} parsed xml doc
 */
async function parseXML(filePath) {
	try {
		let parsed = fs.readFileSync(filePath, 'utf8');
		parsed = XMLJS.parseXml(parsed);
		return parsed;
	} catch (err) {
		logger.error(err);
		return null;
	}
}

/**
 * method to alter an xml element and to append a comment with the provided descriptions
 *
 * @param {string} elem an xml element
 * @param {string} tag xml tag
 * @param {string} desc comment description
 * @returns {string} altered xml element
 */
function alterElem(elem, tag, desc) {
	let altered =
		elem.substring(0, elem.indexOf(`<${tag}>`)) +
		commentElem(elem.substring(elem.indexOf(`<${tag}>`), elem.lastIndexOf(`<${tag}>`))) +
		`${constants.tabSpace}<!-- ${constants.comment}${desc ? desc : ''} -->\n${constants.tabSpace}` +
		elem.substring(elem.lastIndexOf(`<${tag}>`), elem.length);
	return altered;
}

/**
 * method to append HYDROGENERATED: comment element before the changed configurations
 *
 * @param {string} elem an xml element
 * @param {string} tag xml tag
 * @param {string} desc comment description
 * @returns {string} altered xml element
 */
function addHydrogeneratedElem(elem, tag, desc) {
	let altered =
		elem.substring(0, elem.lastIndexOf(`${tag}`)) +
		`${constants.newLine}<!-- ${constants.comment}${desc ? desc : ''} -->\n` +
		elem.substring(elem.lastIndexOf(`${tag}`));
	return altered;
}

/**
 * method to add HYDROGENERATED: comment element
 *
 * @param {string} desc comment description
 */
function addHydrogeneratedComment(desc) {
	return `${constants.newLine}<!-- ${constants.comment}${desc ? desc : ''} -->\n`;
}

/**
 * method to comment an xml element
 *
 * @param {string} elem xml element to be commented
 * @returns {string} commented element
 */
function commentElem(elem) {
	return '<!-- ' + elem + ` -->${constants.newLine}`;
}

/**
 * method to remove declaration of xml version tags
 *
 * @param {string} xml xml document
 * @returns {string} declaration removed xml document
 */
function removeDeclaration(xml) {
	return xml.split('<?xml version="1.0" encoding="UTF-8"?>\n')[1];
}

/**
 * method to comment element using xml path
 *
 * @param {string} xmlPath xml path of the element to be commented
 * @param {string} artifactPath file path of the xml artifact
 */
async function commentElemUsingXMLPath(xmlPath, artifactPath) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to comment element');

	try {
		await parseXML(artifactPath).then((parsed) => {
			let doc = new XMLJS.Document(parsed);

			let defaultElem = parsed.root().get(xmlPath);
			if (defaultElem) {
				let commentElem = new XMLJS.Comment(doc, defaultElem.toString());
				parsed
					.root()
					.get(xmlPath)
					.addPrevSibling(commentElem);
				parsed
					.root()
					.get(xmlPath + '[1]')
					.remove();
				let altered = parsed.toString();

				fs.writeFileSync(artifactPath, altered, constants.utf8);
			}
		});
	} catch (err) {
		logger.error(err);
	}
}

exports.parseXML = parseXML;
exports.alterElem = alterElem;
exports.addHydrogeneratedElem = addHydrogeneratedElem;
exports.commentElem = commentElem;
exports.commentElemUsingXMLPath = commentElemUsingXMLPath;
exports.removeDeclaration = removeDeclaration;
exports.addHydrogeneratedComment = addHydrogeneratedComment;
