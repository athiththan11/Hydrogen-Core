'use strict';

const HydrogenConfigMaps = require('../../maps/map.hydrogen');

/**
 * method to retrieve MySQL datasource config strings
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {('replace'|'setup')} options deployment setup options { options: [setup || replace ]}
 * @returns {{}} datasource configurations
 */
function getDatasourceConfigs(platform, options) {
	let args = {
		_connectionUrl:
			'jdbc:mysql://localhost:3306/wso2mysql?autoReconnect=true&useSSL=false&allowPublicKeyRetrieval=true',
		_defaultAutoCommit: 'false',
		_description: 'The datasource used for registry and user manager',
		_driver: 'com.mysql.jdbc.Driver',
		_jndiName: 'jdbc/WSO2MySQLCarbonDB',
		_maxActive: '80',
		_maxWait: '60000',
		_minIdle: '5',
		_name: 'WSO2_MYSQL_CARBON_DB',
		_password: 'hydrogen',
		_testOnBorrow: 'true',
		_username: 'mysql',
		_validationInterval: '30000',
		_validationQuery: 'SELECT 1',
	};

	if (platform === HydrogenConfigMaps.platform.apim) {
		args._connectionUrl =
			'jdbc:mysql://localhost:3306/wso2amdb?autoReconnect=true&useSSL=false&allowPublicKeyRetrieval=true';
		args._description = 'The datasource used for API Manager database';
		args._jndiName = 'jdbc/WSO2AM_DB';
		args._name = 'WSO2AM_DB';
	}

	if (options.setup && platform === HydrogenConfigMaps.platform.apim) {
		let confs = {};
		args._connectionUrl =
			'jdbc:mysql://localhost:3306/apimgtdb?autoReconnect=true&useSSL=false&allowPublicKeyRetrieval=true';
		confs.am = { ...args };

		args._connectionUrl =
			'jdbc:mysql://localhost:3306/userdb?autoReconnect=true&useSSL=false&allowPublicKeyRetrieval=true';
		args._description = 'The datasource used by user manager';
		args._jndiName = 'jdbc/WSO2UM_DB';
		args._name = 'WSO2UM_DB';
		confs.um = { ...args };

		args._connectionUrl =
			'jdbc:mysql://localhost:3306/regdb?autoReconnect=true&useSSL=false&allowPublicKeyRetrieval=true';
		args._description = 'The datasource used by the registry';
		args._jndiName = 'jdbc/WSO2REG_DB';
		args._name = 'WSO2REG_DB';
		confs.reg = { ...args };

		return confs;
	}

	return args;
}

exports.getDatasourceConfigs = getDatasourceConfigs;
