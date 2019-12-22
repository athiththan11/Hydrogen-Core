'use strict';

/**
 * method to construct JDBC User store configurations
 *
 * @param {*} Element libxmljs Element instance
 * @param {*} xmlDoc parsed libxmljs Document
 * @returns constructed user store element
 */
function constructJDBCUserStore(Element, xmlDoc) {
	let JDBCElem = new Element(xmlDoc, 'UserStoreManager').attr({
		class: 'org.wso2.carbon.user.core.jdbc.JDBCUserStoreManager',
	});
	JDBCElem.node('Property', 'org.wso2.carbon.user.core.tenant.JDBCTenantManager')
		.attr({ name: 'TenantManager' })
		.parent()
		.node('Property', 'false')
		.attr({ name: 'ReadOnly' })
		.parent()
		.node('Property', 'true')
		.attr({ name: 'ReadGroups' })
		.parent()
		.node('Property', 'true')
		.attr({ name: 'WriteGroups' })
		.parent()
		.node('Property', '^[\\S]{3,30}$')
		.attr({ name: 'UsernameJavaRegEx' })
		.parent()
		.node('Property', '^[\\S]{3,30}$')
		.attr({ name: 'UsernameJavaScriptRegEx' })
		.parent()
		.node('Property', 'Username pattern policy violated')
		.attr({ name: 'UsernameJavaRegExViolationErrorMsg' })
		.parent()
		.node('Property', '^[\\S]{5,30}$')
		.attr({ name: 'PasswordJavaRegEx' })
		.parent()
		.node('Property', '^[\\S]{5,30}$')
		.attr({ name: 'PasswordJavaScriptRegEx' })
		.parent()
		.node('Property', 'Password length should be within 5 to 30 characters')
		.attr({ name: 'PasswordJavaRegExViolationErrorMsg' })
		.parent()
		.node('Property', '^[\\S]{3,30}$')
		.attr({ name: 'RolenameJavaRegEx' })
		.parent()
		.node('Property', '^[\\S]{3,30}$')
		.attr({ name: 'RolenameJavaScriptRegEx' })
		.parent()
		.node('Property', 'false')
		.attr({ name: 'CaseInsensitiveUsername' })
		.parent()
		.node('Property', 'false')
		.attr({ name: 'SCIMEnabled' })
		.parent()
		.node('Property', 'false')
		.attr({ name: 'IsBulkImportSupported' })
		.parent()
		.node('Property', 'SHA-256')
		.attr({ name: 'PasswordDigest' })
		.parent()
		.node('Property', 'true')
		.attr({ name: 'StoreSaltedPassword' })
		.parent()
		.node('Property', ',')
		.attr({ name: 'MultiAttributeSeparator' })
		.parent()
		.node('Property', '100')
		.attr({ name: 'MaxUserNameListLength' })
		.parent()
		.node('Property', '100')
		.attr({ name: 'MaxRoleNameListLength' })
		.parent()
		.node('Property', 'true')
		.attr({ name: 'UserRolesCacheEnabled' })
		.parent()
		.node('Property', 'false')
        .attr({ name: 'UserNameUniqueAcrossTenants' });
    
    return JDBCElem;
}

exports.constructJDBCUserStore = constructJDBCUserStore;
