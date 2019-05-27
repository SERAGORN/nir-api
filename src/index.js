const { ApolloServer } = require('apollo-server-lambda');
// const { tradeTokenForUser } = require('./auth-helpers');
const resolvers = require('./resolvers')
const typeDefs = require('./type')
const requireAuthDirective = require("./directives/requireAuthDirective");

const {checkAuth} = require("./query")

const HEADER_NAME = 'authorization';
const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    requireAuth: requireAuthDirective
  },
  // context: async ctx => {
  //   // console.log(c)
  //   // console.log( await checkAuth(ctx.event.headers.authorization.substring(7)))
  //   const a = {
  //     ...ctx.event.headers,
  //     access: await checkAuth(ctx.event.headers.authorization.substring(7))
  //   }

  //   console.log(a)
    
  //   return a
  // },
});

module.exports = server
