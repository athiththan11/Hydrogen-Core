'use strict';

const __path = require('path');
const fs = require('fs');
const XMLJS = require('libxmljs');
const prettify = require('prettify-xml');

const constants = require('../../utils/constants');
const { logger } = require('../../utils/util.winston');
const { parseXML, removeDeclaration } = require('../../utils/util.parser');
const { constructDatasource } = require('./utils/util.datasource');

/**
 * method to alter and construct datasource configurations of AM_DB
 *
 * @param {*} workingDir path of the working directory
 * @param {*} args datasource configuration arguments
 */
async function alterMasterDSofAM(workingDir, args) {
	logger.debug('Starting to alter AM_DB in master-datasource');

	try {
		await parseXML(__path.join(workingDir, constants.path.masterDatasource)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let datasourceElem = constructDatasource(XMLJS.Element, doc, args);

			let amElem = parsed
				.root()
				.get('//*[local-name()="datasources"]/*[local-name()="datasource"][name="WSO2AM_DB"]');
			let commentElem = new XMLJS.Comment(doc, amElem.toString());
			parsed
				.root()
				.get('//*[local-name()="datasources"]/*[local-name()="datasource"][name="WSO2AM_DB"]')
				.addNextSibling(datasourceElem);
			parsed
				.root()
				.get('//*[local-name()="datasources"]/*[local-name()="datasource"][name="WSO2AM_DB"][1]')
				.remove();
			parsed
				.root()
				.get('//*[local-name()="datasources"]/*[local-name()="datasource"][name="WSO2AM_DB"]')
				.addPrevSibling(commentElem);
			let altered = removeDeclaration(parsed.toString());
			let _altered =
				altered.substring(0, altered.indexOf('<datasource><name>WSO2AM_DB</name>')) +
				`${constants.newLine}<!-- ${constants.comment}datasource added -->\n` +
				altered.substring(
					altered.indexOf('<datasource><name>WSO2AM_DB</name>'),
					altered.indexOf('</definition></datasource>') + '</definition></datasource>'.length
				) +
				altered.substring(
					altered.indexOf('</definition></datasource>') + '</definition></datasource>'.length,
					altered.length
				);
			fs.writeFileSync(
				__path.join(workingDir, constants.path.masterDatasource),
				prettify(_altered, { indent: 4 }) + '\n',
				constants.utf8
			);
		});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter and construct datasource configurations of UM_DB
 *
 * @param {*} workingDir path of the working directory
 * @param {*} args datasource configuration arguments
 */
async function alterMasterDSofUM(workingDir, args) {
	logger.debug('Starting to alter UM_DB in master-datasource');

	try {
		await parseXML(__path.join(workingDir, constants.path.masterDatasource)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let datasourceElem = constructDatasource(XMLJS.Element, doc, args);

			parsed
				.root()
				.get('//*[local-name()="datasources"]/*[local-name()="datasource"][name="WSO2AM_DB"]')
				.addNextSibling(datasourceElem);
			let altered = removeDeclaration(parsed.toString());
			let _altered =
				altered.substring(0, altered.indexOf(`<datasource><name>${args._name}</name>`)) +
				`${constants.newLine}<!-- ${constants.comment}datasource added -->\n` +
				altered.substring(
					altered.indexOf(`<datasource><name>${args._name}</name>`),
					altered.indexOf('</definition></datasource>') + '</definition></datasource>'.length
				) +
				altered.substring(
					altered.indexOf('</definition></datasource>') + '</definition></datasource>'.length,
					altered.length
				);
			fs.writeFileSync(
				__path.join(workingDir, constants.path.masterDatasource),
				prettify(_altered, { indent: 4 }) + '\n',
				constants.utf8
			);
		});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter and construct datasource configurations of REG_DB
 *
 * @param {*} workingDir path of the working directory
 * @param {*} args datasource configuration arguments
 */
async function alterMasterDSofREG(workingDir, args) {
	logger.debug('Starting to alter REG_DB in master-datasource');

	try {
		await parseXML(__path.join(workingDir, constants.path.masterDatasource)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let datasourceElem = constructDatasource(XMLJS.Element, doc, args);

			parsed
				.root()
				.get('//*[local-name()="datasources"]/*[local-name()="datasource"][name="WSO2UM_DB"]')
				.addNextSibling(datasourceElem);

			let altered = removeDeclaration(parsed.toString());
			let _altered =
				altered.substring(0, altered.indexOf(`<datasource><name>${args._name}</name>`)) +
				`${constants.newLine}<!-- ${constants.comment}datasource added -->\n` +
				altered.substring(
					altered.indexOf(`<datasource><name>${args._name}</name>`),
					altered.indexOf('</definition></datasource>') + '</definition></datasource>'.length
				) +
				altered.substring(
					altered.indexOf('</definition></datasource>') + '</definition></datasource>'.length,
					altered.length
				);

			fs.writeFileSync(
				__path.join(workingDir, constants.path.masterDatasource),
				prettify(_altered, { indent: 4 }) + '\n',
				constants.utf8
			);
		});
	} catch (err) {
		logger.error(err);
	}
}

/**
 * method to alter and construct master datasource configurations (generic function)
 *
 * @param {*} workingDir path of the working directory
 * @param {*} args datasource configuration arguments
 */
async function alterMasterDS(workingDir, args) {
	logger.debug('Starting to alter master datasource');

	try {
		await parseXML(__path.join(workingDir, constants.path.masterDatasource)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let elem = '<datasource><name>' + args._name;

			let datasourceElem = constructDatasource(XMLJS.Element, doc, args);
			parsed
				.root()
				.get('//*[local-name()="datasources"]/*[local-name()="datasource"]')
				.addNextSibling(datasourceElem);

			let altered = removeDeclaration(parsed.toString());
			let arr = altered.substring(altered.lastIndexOf(elem), altered.length).split('\n');
			let generic = arr[0];
			arr.shift();

			let _altered =
				altered.substring(0, altered.lastIndexOf(elem)) +
				`${constants.newLine}<!-- ${constants.comment}datasource added & replaced -->\n` +
				generic +
				'\n' +
				arr.join('\n');

			fs.writeFileSync(
				__path.join(workingDir, constants.path.masterDatasource),
				prettify(_altered, { indent: 4 }) + '\n',
				constants.utf8
			);
		});
	} catch (err) {
		logger.error(err);
	}
}

exports.alterMasterDSofAM = alterMasterDSofAM;
exports.alterMasterDSofUM = alterMasterDSofUM;
exports.alterMasterDSofREG = alterMasterDSofREG;
exports.alterMasterDS = alterMasterDS;
