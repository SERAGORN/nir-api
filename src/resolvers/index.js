const { getUser, test, getInstitutes, getGroups, getGroup, getEvents, addEvent, updateEvent, createUser, authentication, getMyGroups, setGroup} = require('../query')
const _ = require("lodash");
const mockPosts = [
  { id: 1, title: "Helvetica and Times New Roman walk into a bar. Get out of here! shouts the bartender. We don't serve your type!", ownerId: 1 },
  { id: 2, title: "Why do we tell actors to break a leg? Because every play has a cast.", ownerId: 2 },
  { id: 3, title: "Did you hear about the mathematician who’s afraid of negative numbers? He'll stop at nothing to avoid them.", ownerId: 1 }
];

const resolvers = {
    Query: {
      users: async (name) => {
        return await getUser('Lexa')
      },
      getUser: async (root, data) => {
        let a = await getUser(data)
        return a
      },
      institutes: async (root, {args},context) => {
        return getInstitutes()
        ;
      },
      group: async (root, {id}, context) => {
        return getGroup(id)
      },
      myGroups: async (root, data, context) => {
        return getMyGroups(context)
      },
      posts: () => mockPosts
    },
    Institute: {
      groups: async ({id_institute},{lol}) => {
        return getGroups(id_institute)
      }
    },
    Group: {
      events: async({id_group}) => {
          let a = getEvents(id_group)
          return a
      }
    },
    lol: {
        kek: () => 'lolyamba'
    },
    Mutation: {
      createEvent: async(root, data) => {
        return addEvent(data)
      },
      changeEvent: async(root, data) => {
        return updateEvent(data)
      },
      createUser: async(root, data) => {
        return createUser(data)
      },
      authentication: async(root, data, ctx) => {
        return authentication(data, ctx)
      },
      createGroup: async(root,data, ctx) => {
        return setGroup(data, ctx)
      }
    }
  };

module.exports = _.merge(resolvers)