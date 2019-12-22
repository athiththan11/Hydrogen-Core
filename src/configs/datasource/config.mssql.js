'use strict';

/**
 * method to retrieve MSSQL datasource config strings
 *
 * @param {*} platform wso2 platform ['apim', 'iam']
 * @param {*} options deployment setup options { options: { command: [setup || replace ]}}
 * @returns datasource configurations
 */
function getDatasourceConfigs(platform, options) {
	let args = {
		_connectionUrl: 'jdbc:sqlserver://localhost:1433;databaseName=wso2mssql;SendStringParametersAsUnicode=false',
		_defaultAutoCommit: 'false',
		_description: 'The datasource used for registry and user manager',
		_driver: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
		_jndiName: 'jdbc/WSO2MSSQLCarbonDB',
		_maxActive: '50',
		_maxWait: '60000',
		_minIdle: '5',
		_name: 'WSO2_MSSQL_CARBON_DB',
		_password: 'Hydr0g@n',
		_testOnBorrow: 'true',
		_username: 'sa',
		_validationInterval: '30000',
		_validationQuery: 'SELECT 1',
	};

	if (platform === 'apim') {
		args._connectionUrl =
			'jdbc:sqlserver://localhost:1433;databaseName=wso2amdb;SendStringParametersAsUnicode=false';
		args._defaultAutoCommit = 'true';
		args._description = 'The datasource used for API Manager database';
		args._jndiName = 'jdbc/WSO2AM_DB';
		args._name = 'WSO2AM_DB';
	}

	if (options.command === 'setup' && platform === 'apim') {
		let confs = {};
		args._connectionUrl =
			'jdbc:sqlserver://localhost:1433;databaseName=apimgtdb;SendStringParametersAsUnicode=false';
		confs.am = { ...args };

		args._connectionUrl = 'jdbc:sqlserver://localhost:1433;databaseName=userdb;SendStringParametersAsUnicode=false';
		args._description = 'The datasource used by user manager';
		args._jndiName = 'jdbc/WSO2UM_DB';
		args._name = 'WSO2UM_DB';
		confs.um = { ...args };

		args._connectionUrl = 'jdbc:sqlserver://localhost:1433;databaseName=regdb;SendStringParametersAsUnicode=false';
		args._description = 'The datasource used by the registry';
		args._jndiName = 'jdbc/WSO2REG_DB';
		args._name = 'WSO2REG_DB';
		confs.reg = { ...args };

		return confs;
	}

	return args;
}

exports.getDatasourceConfigs = getDatasourceConfigs;
