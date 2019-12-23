'use strict';

module.exports = {
	mysql: {
		name: 'hydrogen-mysql',
		image: 'mysql',
		tag: '8.0',
		envs: ['MYSQL_USER=mysql', 'MYSQL_PASSWORD=hydrogen', 'MYSQL_ROOT_PASSWORD=hydrogen'],
		ports: {
			'3306/tcp': {},
		},
		cmd: ['--default-authentication-plugin=mysql_native_password'],
		host: {
			PortBindings: {
				'3306/tcp': [
					{
						HostPort: '3306',
					},
				],
			},
		},
	},
	default: {
		user: 'root',
		password: 'hydrogen',
		host: 'localhost',
		port: '3306',
		insecureAuth: true,
		multipleStatements: true,
	},
};
