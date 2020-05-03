'use strict';

const HydrogenConfigMaps = require('../../maps/map.hydrogen');

/**
 * method to retrieve Oracle datasource config strings
 *
 * @param {('apim'|'is')} platform wso2 platform
 * @param {{}}} options deployment setup options { options: { command: [setup || replace ]}}
 * @returns {{}} datasource configurations
 */
function getDatasourceConfigs(platform, options) {
	let args = {
		_connectionUrl: 'jdbc:oracle:thin:@localhost:1521/xe',
		_defaultAutoCommit: 'false',
		_description: 'The datasource used for registry and user manager',
		_driver: 'oracle.jdbc.OracleDriver',
		_jndiName: 'jdbc/WSO2OracleCarbonDB',
		_maxActive: '80',
		_maxWait: '60000',
		_minIdle: '5',
		_name: 'WSO2_ORACLE_CARBON_DB',
		_password: 'oracle',
		_testOnBorrow: 'true',
		_username: 'system',
		_validationInterval: '30000',
		_validationQuery: 'SELECT 1 FROM DUAL',
	};

	if (platform === HydrogenConfigMaps.platform.apim) {
		args._defaultAutoCommit = 'true';
		args._description = 'The datasource used for API Manager database';
		args._jndiName = 'jdbc/WSO2AM_DB';
		args._maxActive = '100';
		args._name = 'WSO2AM_DB';
		args._username = 'wso2amdb';
	}

	if (options.setup && platform == HydrogenConfigMaps.platform.apim) {
		let confs = {};
		args._username = 'apimgtdb';
		confs.am = { ...args };

		args._username = 'userdb';
		args._description = 'The datasource used by user manager';
		args._jndiName = 'jdbc/WSO2UM_DB';
		args._name = 'WSO2UM_DB';
		confs.um = { ...args };

		args._username = 'regdb';
		args._description = 'The datasource used by the registry';
		args._jndiName = 'jdbc/WSO2REG_DB';
		args._name = 'WSO2REG_DB';
		confs.reg = { ...args };

		return confs;
	}

	return args;
}

exports.getDatasourceConfigs = getDatasourceConfigs;
