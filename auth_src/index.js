const { ApolloServer } = require('apollo-server-lambda');
// const { tradeTokenForUser } = require('./auth-helpers');
const { typeDefs, resolvers } = require("./schema.js");
const requireAuthDirective = require("./directives/requireAuthDirective");

const HEADER_NAME = 'authorization';
const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives: {
      requireAuth: requireAuthDirective
    },
    context: ({ req }) => ({
      req: Object.assign({}, req, {
        user: {
          id: 1,
          email: "bill.adama@battlestargalactica.space",
          role: ["USER"]
        }
      })
    })
});

module.exports = server
