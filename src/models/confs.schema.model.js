'use strict';

let publishMultipleGatewaySchema = {
	$id: 'publishmultiplegateway.schema',
	type: 'object',
	properties: {
		environmentConfs: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					type: {
						type: 'string',
					},
					'api-console': {
						type: 'boolean',
					},
					_name: {
						type: 'string',
					},
					_description: {
						type: 'string',
					},
					_hostname: {
						type: 'string',
					},
					username: {
						type: 'string',
					},
					password: {
						type: 'string',
					},
					offset: {
						type: 'number',
						minimum: 1,
					},
				},
				required: ['type', 'api-console', '_name', '_description', '_hostname', 'offset'],
			},
		},
		layoutConfs: {
			type: 'object',
			properties: {
				_hostname: {
					type: 'string',
				},
				thriftClientPort: {
					type: 'string',
				},
				enableThriftServer: {
					type: 'string',
				},
				offset: {
					type: 'number',
					minimum: 0,
				},
			},
			required: ['_hostname', 'thriftClientPort', 'enableThriftServer', 'offset'],
		},
	},
};

let environmentConfsSchema = {
	$id: 'environment.confs.schema',
	type: 'array',
	items: {
		type: 'object',
		properties: {
			type: {
				type: 'string',
			},
			'api-console': {
				type: 'boolean',
			},
			_name: {
				type: 'string',
			},
			_description: {
				type: 'string',
			},
			_hostname: {
				type: 'string',
			},
			username: {
				type: 'string',
			},
			password: {
				type: 'string',
			},
			offset: {
				type: 'number',
				minimum: 1,
			},
		},
		required: ['type', 'api-console', '_name', '_description', '_hostname', 'offset'],
	},
};

let layoutConfsSchema = {
	$id: 'layout.confs.schema',
	type: 'object',
	properties: {
		_hostname: {
			type: 'string',
		},
		thriftClientPort: {
			type: 'string',
		},
		enableThriftServer: {
			type: 'string',
		},
		offset: {
			type: 'number',
			minimum: 0,
		},
	},
	required: ['_hostname', 'thriftClientPort', 'enableThriftServer', 'offset'],
};

let iskmSchema = {
	$id: 'iskm.schema',
	type: 'object',
	properties: {
		apimlayoutConfs: {
			type: 'object',
			properties: {
				_hostname: {
					type: 'string',
				},
				keyValidatorClientType: {
					type: 'string',
				},
				enableThriftServer: {
					type: 'string',
				},
				iskmoffset: {
					type: 'number',
				},
			},
			required: ['_hostname', 'keyValidatorClientType', 'enableThriftServer', 'iskmoffset'],
		},
		iskmlayoutConfs: {
			type: 'object',
			properties: {
				_hostname: {
					type: 'string',
				},
				offset: {
					type: 'number',
				},
			},
			required: ['_hostname', 'offset'],
		},
	},
};

let apimlayoutConfs = {
	$id: 'apim.confs.schema',
	type: 'object',
	properties: {
		_hostname: {
			type: 'string',
		},
		keyValidatorClientType: {
			type: 'string',
		},
		enableThriftServer: {
			type: 'string',
		},
		iskmoffset: {
			type: 'number',
		},
	},
	required: ['_hostname', 'keyValidatorClientType', 'enableThriftServer', 'iskmoffset'],
};

let iskmlayoutConfs = {
	$id: 'iskm.confs.schema',
	type: 'object',
	properties: {
		_hostname: {
			type: 'string',
		},
		offset: {
			type: 'number',
		},
	},
	required: ['_hostname', 'offset'],
};

let distributedSchema = {
	$id: 'distributed.schema',
	type: 'object',
	properties: {
		tmlayoutConfs: {
			type: 'object',
			properties: {
				enableThriftServer: {
					type: 'string',
				},
				offset: {
					type: 'number',
				},
			},
			required: ['enableThriftServer', 'offset'],
		},
		storelayoutConfs: {
			type: 'object',
			properties: {
				_hostname: {
					type: 'string',
				},
				keyValidatorClientType: {
					type: 'string',
				},
				enableThriftServer: {
					type: 'string',
				},
				enableDataPublisher: {
					type: 'string',
				},
				enablePolicyDeployer: {
					type: 'string',
				},
				enableBlockCondition: {
					type: 'string',
				},
				enableJMSConnectionDetails: {
					type: 'string',
				},
				gwoffset: {
					type: 'number',
				},
				kmoffset: {
					type: 'number',
				},
				offset: {
					type: 'number',
				},
			},
			required: [
				'_hostname',
				'keyValidatorClientType',
				'enableThriftServer',
				'enableDataPublisher',
				'enablePolicyDeployer',
				'enableBlockCondition',
				'enableJMSConnectionDetails',
				'gwoffset',
				'kmoffset',
				'offset',
			],
		},
		publisherlayoutConfs: {
			type: 'object',
			properties: {
				_hostname: {
					type: 'string',
				},
				_tcpHostname: {
					type: 'string',
				},
				_sslHostname: {
					type: 'string',
				},
				keyValidatorClientType: {
					type: 'string',
				},
				enableThriftServer: {
					type: 'string',
				},
				enableDataPublisher: {
					type: 'string',
				},
				enableBlockCondition: {
					type: 'string',
				},
				enableJMSConnectionDetails: {
					type: 'string',
				},
				displayURL: {
					type: 'string',
				},
				gwoffset: {
					type: 'number',
				},
				kmoffset: {
					type: 'number',
				},
				storeoffset: {
					type: 'number',
				},
				tmoffset: {
					type: 'number',
				},
				offset: {
					type: 'number',
				},
			},
			required: [
				'_hostname',
				'_tcpHostname',
				'_sslHostname',
				'keyValidatorClientType',
				'enableThriftServer',
				'enableDataPublisher',
				'enableBlockCondition',
				'enableJMSConnectionDetails',
				'displayURL',
				'gwoffset',
				'kmoffset',
				'storeoffset',
				'tmoffset',
				'offset',
			],
		},
		kmlayoutConfs: {
			type: 'object',
			properties: {
				_hostname: {
					type: 'string',
				},
				keyValidatorClientType: {
					type: 'string',
				},
				enableThriftServer: {
					type: 'string',
				},
				enableDataPublisher: {
					type: 'string',
				},
				enablePolicyDeployer: {
					type: 'string',
				},
				enableJMSConnectionDetails: {
					type: 'string',
				},
				gwoffset: {
					type: 'number',
				},
				offset: {
					type: 'number',
				},
			},
			required: [
				'_hostname',
				'keyValidatorClientType',
				'enableThriftServer',
				'enableDataPublisher',
				'enablePolicyDeployer',
				'enableJMSConnectionDetails',
				'gwoffset',
				'offset',
			],
		},
		gatewaylayoutConfs: {
			type: 'object',
			properties: {
				_hostname: {
					type: 'string',
				},
				_tcpHostname: {
					type: 'string',
				},
				_sslHostname: {
					type: 'string',
				},
				keyValidatorClientType: {
					type: 'string',
				},
				enableThriftServer: {
					type: 'string',
				},
				enablePolicyDeployer: {
					type: 'string',
				},
				topicConnectionFactoryQuery: {
					type: 'string',
				},
				kmoffset: {
					type: 'number',
				},
				tmoffset: {
					type: 'number',
				},
				offset: {
					type: 'number',
				},
			},
			required: [
				'_hostname',
				'_tcpHostname',
				'_sslHostname',
				'keyValidatorClientType',
				'enableThriftServer',
				'enablePolicyDeployer',
				'kmoffset',
				'tmoffset',
				'offset',
			],
		},
	},
};

let tmlayoutConfs = {
	$id: 'tm.confs.schema',
	type: 'object',
	properties: {
		enableThriftServer: {
			type: 'string',
		},
		offset: {
			type: 'number',
		},
	},
	required: ['enableThriftServer', 'offset'],
};

let storelayoutConfs = {
	$id: 'store.conf.schema',
	type: 'object',
	properties: {
		_hostname: {
			type: 'string',
		},
		keyValidatorClientType: {
			type: 'string',
		},
		enableThriftServer: {
			type: 'string',
		},
		enableDataPublisher: {
			type: 'string',
		},
		enablePolicyDeployer: {
			type: 'string',
		},
		enableBlockCondition: {
			type: 'string',
		},
		enableJMSConnectionDetails: {
			type: 'string',
		},
		gwoffset: {
			type: 'number',
		},
		kmoffset: {
			type: 'number',
		},
		offset: {
			type: 'number',
		},
	},
	required: [
		'_hostname',
		'keyValidatorClientType',
		'enableThriftServer',
		'enableDataPublisher',
		'enablePolicyDeployer',
		'enableBlockCondition',
		'enableJMSConnectionDetails',
		'gwoffset',
		'kmoffset',
		'offset',
	],
};

let publisherlayoutConfs = {
	$id: 'publisher.confs.schema',
	type: 'object',
	properties: {
		_hostname: {
			type: 'string',
		},
		_tcpHostname: {
			type: 'string',
		},
		_sslHostname: {
			type: 'string',
		},
		keyValidatorClientType: {
			type: 'string',
		},
		enableThriftServer: {
			type: 'string',
		},
		enableDataPublisher: {
			type: 'string',
		},
		enableBlockCondition: {
			type: 'string',
		},
		enableJMSConnectionDetails: {
			type: 'string',
		},
		displayURL: {
			type: 'string',
		},
		gwoffset: {
			type: 'number',
		},
		kmoffset: {
			type: 'number',
		},
		storeoffset: {
			type: 'number',
		},
		tmoffset: {
			type: 'number',
		},
		offset: {
			type: 'number',
		},
	},
	required: [
		'_hostname',
		'_tcpHostname',
		'_sslHostname',
		'keyValidatorClientType',
		'enableThriftServer',
		'enableDataPublisher',
		'enableBlockCondition',
		'enableJMSConnectionDetails',
		'displayURL',
		'gwoffset',
		'kmoffset',
		'storeoffset',
		'tmoffset',
		'offset',
	],
};

let kmlayoutConfs = {
	$id: 'km.confs.schema',
	type: 'object',
	properties: {
		_hostname: {
			type: 'string',
		},
		keyValidatorClientType: {
			type: 'string',
		},
		enableThriftServer: {
			type: 'string',
		},
		enableDataPublisher: {
			type: 'string',
		},
		enablePolicyDeployer: {
			type: 'string',
		},
		enableJMSConnectionDetails: {
			type: 'string',
		},
		gwoffset: {
			type: 'number',
		},
		offset: {
			type: 'number',
		},
	},
	required: [
		'_hostname',
		'keyValidatorClientType',
		'enableThriftServer',
		'enableDataPublisher',
		'enablePolicyDeployer',
		'enableJMSConnectionDetails',
		'gwoffset',
		'offset',
	],
};

let gatewaylayoutConfs = {
	$id: 'gateway.confs.schema',
	type: 'object',
	properties: {
		_hostname: {
			type: 'string',
		},
		_tcpHostname: {
			type: 'string',
		},
		_sslHostname: {
			type: 'string',
		},
		keyValidatorClientType: {
			type: 'string',
		},
		enableThriftServer: {
			type: 'string',
		},
		enablePolicyDeployer: {
			type: 'string',
		},
		topicConnectionFactoryQuery: {
			type: 'string',
		},
		kmoffset: {
			type: 'number',
		},
		tmoffset: {
			type: 'number',
		},
		offset: {
			type: 'number',
		},
	},
	required: [
		'_hostname',
		'_tcpHostname',
		'_sslHostname',
		'keyValidatorClientType',
		'enableThriftServer',
		'enablePolicyDeployer',
		'kmoffset',
		'tmoffset',
		'offset',
	],
};

exports.publishMultipleGatewaySchema = publishMultipleGatewaySchema;
exports.environmentConfsSchema = environmentConfsSchema;
exports.layoutConfsSchema = layoutConfsSchema;

exports.iskmSchema = iskmSchema;
exports.apimlayoutConfs = apimlayoutConfs;
exports.iskmlayoutConfs = iskmlayoutConfs;

exports.distributedSchema = distributedSchema;
exports.tmlayoutConfs = tmlayoutConfs;
exports.storelayoutConfs = storelayoutConfs;
exports.publisherlayoutConfs = publisherlayoutConfs;
exports.kmlayoutConfs = kmlayoutConfs;
exports.gatewaylayoutConfs = gatewaylayoutConfs;
