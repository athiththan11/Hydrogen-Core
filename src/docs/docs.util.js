'use strict';

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

exports.generateDBDriverDocs = generateDBDriverDocs;
