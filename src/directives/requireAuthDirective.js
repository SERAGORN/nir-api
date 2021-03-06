const {
    SchemaDirectiveVisitor,
    AuthenticationError
  } = require("apollo-server-lambda");
  
  class RequireAuthDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
      const { resolve = defaultFieldResolver } = field;
      const { role } = this.args;
      field.resolve = async function(...args) {
        const [, , ctx] = args;
        if (ctx.access) {
          const result = await resolve.apply(this, args);
          return result;
        } else {
          throw new AuthenticationError(
            "You are not authorized to view this resource."
          );
        }
        // if (ctx.req && ctx.req.user) {
        //   if (role && (!ctx.req.user.role || !ctx.req.user.role.includes(role))) {

        //   } else {
            
        //     return result;
        //   }
        // } else {
        //   throw new AuthenticationError(
        //     "You must be signed in to view this resource."
        //   );
        // }
      };
    }
  }
  
  module.exports = RequireAuthDirective;