const server = require('./auth_src')

exports.authHandler = server.createHandler();