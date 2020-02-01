'use strict';

let publishMultipleGatewaySchema = {
	$id: 'publismultiplegateway.schema',
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
					minimum: 1,
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
			minimum: 1,
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

exports.publishMultipleGatewaySchema = publishMultipleGatewaySchema;
exports.environmentConfsSchema = environmentConfsSchema;
exports.layoutConfsSchema = layoutConfsSchema;

exports.iskmSchema = iskmSchema;
exports.apimlayoutConfs = apimlayoutConfs;
exports.iskmlayoutConfs = iskmlayoutConfs;
