'use strict';

module.exports = {
	oracle: {
		name: 'hydrogen-oracle',
		image: 'truevoly/oracle-12c',
		tag: '',
		envs: [],
		ports: {},
		host: {
			PortBindings: {},
		},
	},
	default: {
		user: 'oracle',
		password: 'hydrogen',
		host: 'localhost',
		port: '1',
	},
};
