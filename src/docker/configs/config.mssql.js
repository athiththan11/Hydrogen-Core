'use strict';

module.exports = {
	mssql: {
		name: 'hydrogen-mssql',
		image: 'microsoft/mssql-server-linux',
		tag: '2017-latest',
		envs: ['ACCEPT_EULA=Y', 'SA_PASSWORD=Hydr0g@n'],
		ports: {
			'1433/tcp': {},
		},
		host: {
			PortBindings: {
				'1433/tcp': [
					{
						HostPort: '1433',
					},
				],
			},
		},
	},
	default: {
		user: 'sa',
		password: 'Hydr0g@n',
		server: 'localhost',
	},
};
