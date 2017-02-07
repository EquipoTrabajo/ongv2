var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'ong'
    },
    port: process.env.PORT || 3000,
    db: process.env.DATABASE
  },

  test: {
    root: rootPath,
    app: {
      name: 'ong'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/ong-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'ong'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/ong-production'
  }
};

module.exports = config[env];
