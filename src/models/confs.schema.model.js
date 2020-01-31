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
					type: 'number',
					minimum: 10397,
				},
				enableThriftServer: {
					type: 'boolean',
				},
				offset: {
					type: 'number',
					minimum: 0,
				},
			},
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
			type: 'number',
			minimum: 10397,
		},
		enableThriftServer: {
			type: 'boolean',
		},
		offset: {
			type: 'number',
			minimum: 0,
		},
	},
};

exports.publishMultipleGatewaySchema = publishMultipleGatewaySchema;
exports.environmentConfsSchema = environmentConfsSchema;
exports.layoutConfsSchema = layoutConfsSchema;
