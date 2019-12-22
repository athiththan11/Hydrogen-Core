'use strict';

const { logger } = require('../../../utils/util.winston');

/**
 * method to construct datasources
 *
 * @param {XML Element Lib} Element libxmljs.Element instance
 * @param {XML Document} xmlDoc parsed libxmljs Document
 * @param {any} args datasource parameters and connection strings
 * @returns constructed datasource element
 */
function constructDatasource(Element, xmlDoc, args) {
    logger.debug('Starting to construct datasource element');
    
	let datasourceElem = new Element(xmlDoc, 'datasource');
	datasourceElem
		.node('name', args._name)
		.parent()
		.node('description', args._description)
		.parent()
		.node('jndiConfig')
		.node('name', args._jndiName)
		.parent()
		.parent()
		.node('definition')
		.attr({ type: 'RDBMS' })
		.node('configuration')
		.node('url', args._connectionUrl)
		.parent()
		.node('username', args._username)
		.parent()
		.node('password', args._password)
		.parent()
		.node('driverClassName', args._driver)
		.parent()
		.node('maxActive', args._maxActive)
		.parent()
		.node('maxWait', args._maxWait)
		.parent()
		.node('minIdle', args._minIdle)
		.parent()
		.node('testOnBorrow', args._testOnBorrow)
		.parent()
		.node('validationQuery', args._validationQuery)
		.parent()
		.node('validationInterval', args._validationInterval)
		.parent()
        .node('defaultAutoCommit', args._defaultAutoCommit);
    
	return datasourceElem;
}

exports.constructDatasource = constructDatasource;
