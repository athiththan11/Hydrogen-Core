'use strict';

const __path = require('path');
const fs = require('fs');
const XMLJS = require('libxmljs');
const prettify = require('prettify-xml');

const constants = require('../../utils/constants');
const { logger } = require('../../utils/util.winston');
const { parseXML } = require('../../utils/util.parser');
const { constructJDBCUserStore } = require('../user.management/utils/util.usermgt');

/**
 * method to alter and construct user management and user store configurations
 *
 * @param {boolean} convertLDAPToJDBC boolean value representing to convert LDAP to JDBC
 * @param {*} [workingDir=process.cwd()] path of the working directory
 */
async function alterUserManagement(convertLDAPToJDBC, workingDir = process.cwd()) {
	if (process.env.HYDROGEN_DEBUG) logger.debug('Starting to alter user-management');

	try {
		await parseXML(__path.join(workingDir, constants.path.userManagement)).then((parsed) => {
			let doc = new XMLJS.Document(parsed);
			let propertyElem = new XMLJS.Element(doc, 'Property', 'jdbc/WSO2UM_DB').attr({ name: 'dataSource' });

			let datasourceElem = parsed
				.root()
				.get(
					'//*[local-name()="Realm"]/*[local-name()="Configuration"]/*[local-name()="Property"][@name="dataSource"]'
				);
			let commentElem = new XMLJS.Comment(doc, datasourceElem.toString());

			parsed
				.root()
				.get(
					'//*[local-name()="Realm"]/*[local-name()="Configuration"]/*[local-name()="Property"][@name="dataSource"]'
				)
				.addNextSibling(propertyElem);
			parsed
				.root()
				.get(
					'//*[local-name()="Realm"]/*[local-name()="Configuration"]/*[local-name()="Property"][@name="dataSource"][1]'
				)
				.remove();
			parsed
				.root()
				.get(
					'//*[local-name()="Realm"]/*[local-name()="Configuration"]/*[local-name()="Property"][@name="dataSource"]'
				)
				.addPrevSibling(commentElem);

			if (convertLDAPToJDBC) {
				if (process.env.HYDROGEN_DEBUG) logger.debug('Converting LDAP to JDBC User Store');

				let jdbcElem = constructJDBCUserStore(XMLJS.Element, doc);

				let ldapElem = parsed
					.root()
					.get(
						'//*[local-name()="Realm"]/*[local-name()="UserStoreManager"][@class="org.wso2.carbon.user.core.ldap.ReadWriteLDAPUserStoreManager"]'
					);
				commentElem = new XMLJS.Comment(doc, ldapElem.toString());
				parsed
					.root()
					.get(
						'//*[local-name()="Realm"]/*[local-name()="UserStoreManager"][@class="org.wso2.carbon.user.core.ldap.ReadWriteLDAPUserStoreManager"]'
					)
					.addNextSibling(jdbcElem);
				parsed
					.root()
					.get(
						'//*[local-name()="Realm"]/*[local-name()="UserStoreManager"][@class="org.wso2.carbon.user.core.ldap.ReadWriteLDAPUserStoreManager"]'
					)
					.remove();
				parsed
					.root()
					.get(
						'//*[local-name()="Realm"]/*[local-name()="UserStoreManager"][@class="org.wso2.carbon.user.core.jdbc.JDBCUserStoreManager"]'
					)
					.addPrevSibling(commentElem);
			}

			let altered = parsed.toString();

			let _altered =
				altered.substring(0, altered.indexOf('<Property name="dataSource">jdbc/WSO2UM_DB')) +
				`${constants.newLine}<!-- ${constants.comment}datasource changed -->\n` +
				altered.substring(altered.indexOf('<Property name="dataSource">jdbc/WSO2UM_DB'), altered.length);

			if (convertLDAPToJDBC) {
				_altered =
					_altered.substring(
						0,
						_altered.lastIndexOf(
							'<UserStoreManager class="org.wso2.carbon.user.core.jdbc.JDBCUserStoreManager">'
						)
					) +
					`${constants.newLine}<!-- ${constants.comment}user store manager changed to jdbc -->\n` +
					_altered.substring(
						_altered.lastIndexOf(
							'<UserStoreManager class="org.wso2.carbon.user.core.jdbc.JDBCUserStoreManager">'
						)
					);
			}

			fs.writeFileSync(
				__path.join(workingDir, constants.path.userManagement),
				prettify(_altered, { indent: 4 }) + '\n',
				constants.utf8
			);
		});
	} catch (err) {
		logger.error(err);
	}
}

exports.alterUserManagement = alterUserManagement;
