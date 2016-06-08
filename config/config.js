
import path from 'path';
let rootPath = path.normalize(__dirname + '/..');

module.exports = {
	development: {
		db: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/LS_dev',
		root: rootPath,
		app: {
			name: 'LS BackEnd API'
		},
		secret:'LS secret'
//		avatarUploadDir: 'uploads/avatar/',
//		avatarUploadUrl: 'https://54.218.54.176/LS/uploads/avatar/'
	},
	test: {
		db: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/LS_test',
		root: rootPath,
		app: {
			name: 'LS BackEnd API'
		},
		secret:'LS secret'
	},
	production: {
		db: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/LS_prod',
		root: rootPath,
		app: {
			name: 'LS BackEnd API'
		},
		secret:'LS secret'
	}
};