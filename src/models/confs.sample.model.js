'use strict';

let environmentConfs = [
	{
		type: 'production',
		'api-console': true,
		_name: 'Production environment one',
		_description: 'a sample environment',
		_hostname: 'localhost',
		username: 'admin',
		password: 'admin',
		offset: 1,
	},
	{
		type: 'staging',
		'api-console': true,
		_name: 'Staging environment one',
		_description: 'a sample stage environment',
		_hostname: 'localhost',
		offset: 2,
	},
];

let layoutConfs = {
	_hostname: 'https://localhost',
	thriftClientPort: 10397,
	enableThriftServer: false,
	offset: 0,
};

exports.environmentConfs = environmentConfs;
exports.layoutConf = layoutConfs;
