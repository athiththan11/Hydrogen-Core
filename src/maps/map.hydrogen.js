'use strict';

module.exports = {
	platform: {
		apim: 'apim',
		is: 'is',
	},
	datasource: {
		mssql: 'mssql',
		mysql: 'mysql',
		oracle: 'oracle',
		postgre: 'postgre',
		scripts: {
			mssql: 'mssql.sql',
			mysql: 'mysql.sql',
			postgre: 'postgresql.sql',
		},
	},
	ports: {
		_9443: 9443,
		_5672: 5672,
	},
	jdbcDrivers: {
		mssql:
			'https://docs.microsoft.com/en-us/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server?view=sql-server-2017',
		mysql: 'https://www.mysql.com/products/connector/',
		oracle: 'https://www.oracle.com/technetwork/database/application-development/jdbc/downloads/index.html',
		postgre: 'https://jdbc.postgresql.org/',
	},
	scripts: {
		mysql: {
			allowInvalidDates: "SET SQL_MODE='ALLOW_INVALID_DATES';",
		},
	},
	artifactPaths: {
		conf: {
			carbon: '/repository/conf/carbon.xml',
			identity: '/repository/conf/identity/identity.xml',
			jndiProperties: '/repository/conf/jndi.properties',
			masterDatasource: '/repository/conf/datasources/master-datasources.xml',
			registry: '/repository/conf/registry.xml',
			userManagement: '/repository/conf/user-mgt.xml',
		},
		scripts: {
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
	},
	xmlPaths: {
		usermgt: {
			realm_configuration_property_datasource:
				'//*[local-name()="Realm"]/*[local-name()="Configuration"]/*[local-name()="Property"][@name="dataSource"]',
			realm_userstoremanager_readwriteldapuserstoremanager:
				'//*[local-name()="Realm"]/*[local-name()="UserStoreManager"][@class="org.wso2.carbon.user.core.ldap.ReadWriteLDAPUserStoreManager"]',
			realm_userstoremanager_jdbcuserstoremanager:
				'//*[local-name()="Realm"]/*[local-name()="UserStoreManager"][@class="org.wso2.carbon.user.core.jdbc.JDBCUserStoreManager"]',
		},
		registry: {
			dbconfig_wso2registry: '//*[local-name()="dbConfig"][@name="wso2registry"]',
			dbconfig: '//*[local-name()="dbConfig"]',
			remoteinstance: '//*[local-name()="remoteInstance"]',
			mount: '//*[local-name()="mount"]',
		},
		masterdatasource: {
			datasources_datasource: '//*[local-name()="datasources"]/*[local-name()="datasource"]',
			datasources_datasource_wso2am_db:
				'//*[local-name()="datasources"]/*[local-name()="datasource"][name="WSO2AM_DB"]',
			datasources_datasource_wso2um_db:
				'//*[local-name()="datasources"]/*[local-name()="datasource"][name="WSO2UM_DB"]',
		},
		identity: {
			jdbcpersistencemanager_datasource_name:
				'//*[local-name()="JDBCPersistenceManager"]/*[local-name()="DataSource"]/*[local-name()="Name"]',
		},
		carbon: {
			ports_offset: '//*[local-name()="Ports"]/*[local-name()="Offset"]',
		},
	},
	strings: {
		jdbc_wso2um_db: 'jdbc/WSO2UM_DB',
		jdbc_wso2carbondb: 'jdbc/WSO2CarbonDB',
	},
	encodings: {
		utf8: 'encoding="UTF-8"',
		iso_8859_1: 'encoding="ISO-8859-1"',
	},
	docker: {
		apim: {
			single: 'wso2amdb',
			setup: ['apimgtdb', 'userdb', 'regdb'],
		},
		is: {
			single: {
				mssql: 'wso2mssql',
				mysql: 'wso2mysql',
				postgre: 'wso2postgres',
			},
		},
		timeout: {
			mssql: 10000,
			mysql: 20000,
			postgre: 5000,
		},
	},
};
