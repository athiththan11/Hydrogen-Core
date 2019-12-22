'use strict';

exports.MasterDatasource = {
	Generic: require('./src/modules/master.datasource/datasource.util'),
	Util: require('./src/modules/master.datasource/utils/util.datasource'),
};

exports.UserMgt = {
	Generic: require('./src/modules/user.management/usermgt.util'),
	Util: require('./src/modules/user.management/utils/util.usermgt'),
};

exports.Carbon = {
	Generic: require('./src/modules/carbon/carbon.util'),
};

exports.JNDIProperties = {
	Generic: require('./src/modules/jndi.properties/jndi.util'),
};

exports.Identity = {
	Generic: require('./src/modules/identity/identity.util'),
};

exports.Registry = {
	Generic: require('./src/modules/registry/registry.util'),
	Util: require('./src/modules/registry/utils/util.registry'),
};
