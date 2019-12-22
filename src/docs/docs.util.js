'use strict';

const { logger } = require('../utils/util.winston');

/**
 * method to generate docs and logs for the database drivers based on given database type
 *
 * @param {('postgre'|'mysql'|'mssql'|'oracle')} databaseType type of the database is being used
 */
function generateDBDriverDocs(databaseType) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Generating database driver docs');
	
	switch (databaseType.toLowerCase()) {
		case 'postgres':
			logger.info('Please download the Postgre JDBC Driver from https://jdbc.postgresql.org/');
			break;
		case 'mysql':
			logger.info('Please download the MySQL JDBC Driver from https://www.mysql.com/products/connector/');
			break;
		case 'mssql':
			logger.info(
				'Please download the MSSQL JDBC Driver from https://docs.microsoft.com/en-us/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server?view=sql-server-2017'
			);
			break;
		case 'oracle':
			logger.info(
				'Please download the ORacle JDBC Driver from https://www.oracle.com/technetwork/database/application-development/jdbc/downloads/index.html'
			);
			break;
	}
}

exports.generateDBDriverDocs = generateDBDriverDocs;