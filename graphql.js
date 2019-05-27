const server = require('./src')

exports.graphqlHandler = server.createHandler({
    cors: {
        origin: '*',
        credentials: true,
      },
});