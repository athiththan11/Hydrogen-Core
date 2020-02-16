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
	thriftClientPort: '10397',
	enableThriftServer: 'false',
	offset: 1,
};

let apimlayoutConfs = {
	_hostname: 'https://localhost',
	keyValidatorClientType: 'WSClient',
	enableThriftServer: 'false',
	iskmoffset: 1,
};

let iskmlayoutConfs = {
	_hostname: 'https://localhost',
	offset: 1,
};

let distributedConfs = {
	tmlayoutConfs: tmlayoutConfs,
	storelayoutConfs: storelayoutConfs,
	publisherlayoutConfs: publisherlayoutConfs,
	kmlayoutConfs: kmlayoutConfs,
	gatewaylayoutConfs: gatewaylayoutConfs,
};

let tmlayoutConfs = {
	enableThriftServer: 'false',
	offset: 4,
};

let storelayoutConfs = {
	_hostname: 'https://localhost',
	keyValidatorClientType: 'WSCLient',
	enableThriftServer: 'false',
	enableDataPublisher: 'false',
	enablePolicyDeployer: 'false',
	enableBlockCondition: 'false',
	enableJMSConnectionDetails: 'false',
	gwoffset: 0,
	kmoffset: 1,
	offset: 3,
};

let publisherlayoutConfs = {
	_hostname: 'https://localhost',
	_tcpHostname: 'tcp://localhost',
	_sslHostname: 'ssl://localhost',
	enableThriftServer: 'false',
	enableDataPublisher: 'false',
	enableBlockCondition: 'false',
	enableJMSConnectionDetails: 'false',
	displayURL: 'true',
	gwoffset: 0,
	kmoffset: 1,
	storeoffset: 3,
	tmoffset: 4,
	offset: 2,
};

let kmlayoutConfs = {
	_hostname: 'https://localhost',
	keyValidatorClientType: 'WSCLient',
	enableThriftServer: 'false',
	enablePolicyDeployer: 'false',
	gwoffset: 0,
	offset: 1,
};

let gatewaylayoutConfs = {
	_hostname: 'https://localhost',
	_tcpHostname: 'tcp://localhost',
	_sslHostname: 'ssl://localhost',
	keyValidatorClientType: 'WSCLient',
	enableThriftServer: 'false',
	enablePolicyDeployer: 'false',
	topicConnectionFactoryQuery: "?retries='5'%26connectdelay='50''",
	kmoffset: 1,
	tmoffset: 4,
	offset: 0,
};

exports.environmentConfs = environmentConfs;
exports.layoutConfs = layoutConfs;
exports.apimlayoutConfs = apimlayoutConfs;
exports.iskmlayoutConfs = iskmlayoutConfs;
exports.distributedConfs = distributedConfs;
exports.tmlayoutConfs = tmlayoutConfs;
exports.storelayoutConfs = storelayoutConfs;
exports.publisherlayoutConfs = publisherlayoutConfs;
exports.kmlayoutConfs = kmlayoutConfs;
exports.gatewaylayoutConfs = gatewaylayoutConfs;
