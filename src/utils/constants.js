'use strict';

module.exports = {
	comment: 'HYDROGENERATED: ',
	newLine: '\n\n',
	tabSpace: '\t\t',
	utf8: 'utf8',
	path: {
		carbon: '/repository/conf/carbon.xml',
		identity: '/repository/conf/identity/identity.xml',
		jndiProperties: '/repository/conf/jndi.properties',
		masterDatasource: '/repository/conf/datasources/master-datasources.xml',
		registry: '/repository/conf/registry.xml',
		userManagement: '/repository/conf/user-mgt.xml',
	},
	sql: {
		apim: {
			apimgt: '/dbscripts/apimgt',
			dbscripts: '/dbscripts',
			mbstore: '/dbscripts/mb-store',
		},
		is: {
			consent: '/dbscripts/consent',
			dbscripts: '/dbscripts',
			identity: '/dbscripts/identity',
			storedProcedure: '/dbscripts/identity/stored-procedures',
			uma: '/dbscripts/identity/uma',
		},
	},
	dbscripts: {
		postgre: 'postgresql.sql',
		mysql: 'mysql.sql',
		mssql: 'mssql.sql',
	},
	ports: {
		_9443: 9443,
		_5672: 5672,
	},
};
