'use strict';

const __path = require('path');
const fs = require('fs');
const XMLJS = require('libxmljs');
const prettify = require('prettify-xml');

const constants = require('../../utils/constants');
const HydrogenConfigMaps = require('../../maps/map.hydrogen');
const { logger } = require('../../utils/util.winston');
const { parseXML, removeDeclaration } = require('../../utils/util.parser');
const { constructDatasource } = require('./utils/util.datasource');

/**
 * method to alter and construct datasource configurations of AM_DB
 *
 * @param {*} datasourceConfs datasource configuration arguments
 * @param {*} workingDir path of the working directory
 */
async function alterMasterDSofAM(datasourceConfs, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter AM_DB in master-datasource');

	try {
		await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.masterDatasource)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let datasourceElem = constructDatasource(XMLJS.Element, doc, datasourceConfs);

			let amElem = parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.masterdatasource.datasources_datasource_wso2am_db);
			let commentElem = new XMLJS.Comment(doc, amElem.toString());
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.masterdatasource.datasources_datasource_wso2am_db)
				.addNextSibling(datasourceElem);
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.masterdatasource.datasources_datasource_wso2am_db + '[1]')
				.remove();
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.masterdatasource.datasources_datasource_wso2am_db)
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
				__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.masterDatasource),
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
 * @param {*} datasourceConfs datasource configuration arguments
 * @param {*} workingDir path of the working directory
 */
async function alterMasterDSofUM(datasourceConfs, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter UM_DB in master-datasource');

	try {
		await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.masterDatasource)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let datasourceElem = constructDatasource(XMLJS.Element, doc, datasourceConfs);

			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.masterdatasource.datasources_datasource_wso2am_db)
				.addNextSibling(datasourceElem);
			let altered = removeDeclaration(parsed.toString());
			let _altered =
				altered.substring(0, altered.indexOf(`<datasource><name>${datasourceConfs._name}</name>`)) +
				`${constants.newLine}<!-- ${constants.comment}datasource added -->\n` +
				altered.substring(
					altered.indexOf(`<datasource><name>${datasourceConfs._name}</name>`),
					altered.indexOf('</definition></datasource>') + '</definition></datasource>'.length
				) +
				altered.substring(
					altered.indexOf('</definition></datasource>') + '</definition></datasource>'.length,
					altered.length
				);
			fs.writeFileSync(
				__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.masterDatasource),
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
 * @param {*} datasourceConfs datasource configuration arguments
 * @param {*} workingDir path of the working directory
 */
async function alterMasterDSofREG(datasourceConfs, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter REG_DB in master-datasource');

	try {
		await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.masterDatasource)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let datasourceElem = constructDatasource(XMLJS.Element, doc, datasourceConfs);

			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.masterdatasource.datasources_datasource_wso2um_db)
				.addNextSibling(datasourceElem);

			let altered = removeDeclaration(parsed.toString());
			let _altered =
				altered.substring(0, altered.indexOf(`<datasource><name>${datasourceConfs._name}</name>`)) +
				`${constants.newLine}<!-- ${constants.comment}datasource added -->\n` +
				altered.substring(
					altered.indexOf(`<datasource><name>${datasourceConfs._name}</name>`),
					altered.indexOf('</definition></datasource>') + '</definition></datasource>'.length
				) +
				altered.substring(
					altered.indexOf('</definition></datasource>') + '</definition></datasource>'.length,
					altered.length
				);

			fs.writeFileSync(
				__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.masterDatasource),
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
 * @param {*} datasourceConfs datasource configuration arguments
 * @param {*} workingDir path of the working directory
 */
async function alterMasterDS(datasourceConfs, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter master datasource');

	try {
		await parseXML(__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.masterDatasource)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let elem = '<datasource><name>' + datasourceConfs._name;

			let datasourceElem = constructDatasource(XMLJS.Element, doc, datasourceConfs);
			parsed
				.root()
				.get(HydrogenConfigMaps.xmlPaths.masterdatasource.datasources_datasource)
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
				__path.join(workingDir, HydrogenConfigMaps.artifactPaths.conf.masterDatasource),
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
