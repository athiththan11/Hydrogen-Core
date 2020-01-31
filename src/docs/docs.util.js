'use strict';

const EasyTable = require('easy-table');

const { logger } = require('../utils/util.winston');
const HydrogenConfigMaps = require('../maps/map.hydrogen');

/**
 * method to generate docs and logs for the database drivers based on given database type
 *
 * @param {('postgre'|'mysql'|'mssql'|'oracle')} databaseType type of the database is being used
 */
function generateDBDriverDocs(databaseType) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Generating database driver docs');

	switch (databaseType.toLowerCase()) {
		case HydrogenConfigMaps.datasource.postgre:
			logger.info('Please download the Postgre JDBC Driver from ' + HydrogenConfigMaps.jdbcDrivers.postgre);
			break;
		case HydrogenConfigMaps.datasource.mysql:
			logger.info('Please download the MySQL JDBC Driver from ' + HydrogenConfigMaps.jdbcDrivers.mysql);
			break;
		case HydrogenConfigMaps.datasource.mssql:
			logger.info('Please download the MSSQL JDBC Driver from ' + HydrogenConfigMaps.jdbcDrivers.mssql);
			break;
		case HydrogenConfigMaps.datasource.oracle:
			logger.info('Please download the Oracle JDBC Driver from ' + HydrogenConfigMaps.jdbcDrivers.oracle);
			break;
	}
}

/**
 * method to generate docs for publish-multiple-gateway deployment layout
 *
 * @param {number} gwCount number of gateway nodes
 * @param {{}} layoutConfs layout configurations
 */
function generatePublishMultipleGatewayDocs(gwCount, layoutConfs) {
	if (process.env.HYDROGEN_DEBUG)
		logger.debug('Generating docs for deployment layout Publish through Multiple Gateways');

	let table = new EasyTable();
	table.cell('node', HydrogenConfigMaps.layoutNamePatterns.apim.publishMultipleGateway.aio);
	table.cell('port offset', 0);
	table.cell('port', HydrogenConfigMaps.ports._9443);
	table.newRow();
	for (let index = 0; index < gwCount; index++) {
		table.cell('node', HydrogenConfigMaps.layoutNamePatterns.apim.publishMultipleGateway.gw_node + index + 1);
		table.cell('port offset', layoutConfs.offset + index + 1);
		table.cell('port', HydrogenConfigMaps.ports._9443 + index + 1);
		table.newRow();
	}
	logger.info('\n\n' + table.toString() + '\n');
}

exports.generateDBDriverDocs = generateDBDriverDocs;
exports.generatePublishMultipleGatewayDocs = generatePublishMultipleGatewayDocs;
