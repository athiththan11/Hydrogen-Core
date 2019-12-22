'use strict';

/**
 * method to retrieve Postgre datasource config strings
 *
 * @param {*} platform wso2 platform ['apim', 'iam']
 * @param {*} options deployment setup options { options: { command: [setup || replace ]}}
 * @returns datasource configurations
 */
function getDatasourceConfigs(platform, options) {
	let args = {
		_connectionUrl: 'jdbc:postgresql://localhost:5432/wso2postgres',
		_defaultAutoCommit: 'true',
		_description: 'The datasource used for registry and user manager',
		_driver: 'org.postgresql.Driver',
		_jndiName: 'jdbc/WSO2PostgresCarbonDB',
		_maxActive: '80',
		_maxWait: '60000',
		_minIdle: '5',
		_name: 'WSO2_POSTGRES_CARBON_DB',
		_password: 'hydrogen',
		_testOnBorrow: 'true',
		_username: 'postgres',
		_validationInterval: '30000',
		_validationQuery: 'SELECT 1; COMMIT',
	};

	if (platform === 'apim') {
		args._connectionUrl = 'jdbc:postgresql://localhost:5432/wso2amdb';
		args._defaultAutoCommit = 'true';
		args._description = 'The datasource used for API Manager database';
		args._jndiName = 'jdbc/WSO2AM_DB';
		args._name = 'WSO2AM_DB';
	}

	if (options.command === 'setup' && platform === 'apim') {
		let confs = {};
		args._connectionUrl = 'jdbc:postgresql://localhost:5432/apimgtdb';
		confs.am = { ...args };

		args._connectionUrl = 'jdbc:postgresql://localhost:5432/userdb';
		args._description = 'The datasource used by user manager';
		args._jndiName = 'jdbc/WSO2UM_DB';
		args._name = 'WSO2UM_DB';
		confs.um = { ...args };

		args._connectionUrl = 'jdbc:postgresql://localhost:5432/regdb';
		args._description = 'The datasource used by the registry';
		args._jndiName = 'jdbc/WSO2REG_DB';
		args._name = 'WSO2REG_DB';
		confs.reg = { ...args };

		return confs;
	}

	return args;
}

exports.getDatasourceConfigs = getDatasourceConfigs;
