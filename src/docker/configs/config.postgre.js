'use strict';

module.exports = {
	postgre: {
		name: 'hydrogen-postgres',
		image: 'postgres',
		tag: '9.6.14',
		envs: ['POSTGRES_PASSWORD=hydrogen'],
		ports: {
			'5432/tcp': {},
		},
		host: {
			PortBindings: {
				'5432/tcp': [
					{
						HostPort: '5432',
					},
				],
			},
		},
	},
	default: {
		user: 'postgre',
		password: 'hydrogen',
		host: 'localhost',
		port: '5432',
	},
};
