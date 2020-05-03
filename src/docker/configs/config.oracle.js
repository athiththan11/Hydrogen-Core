'use strict';

module.exports = {
	oracle: {
		name: 'hydrogen-oracle',
		image: 'truevoly/oracle-12c',
		tag: 'latest',
		envs: [],
		ports: {
			'8080/tcp': {},
			'1521/tcp': {},
		},
		host: {
			PortBindings: {
				'8080/tcp': [
					{
						HostPort: '8080',
					},
				],
				'1521/tcp': [
					{
						HostPort: '1521',
					},
				],
			},
		},
	},
	default: {
		user: 'system',
		password: 'oracle',
		connectString: 'localhost:1521/xe',
	},
};
