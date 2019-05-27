const { gql } = require('apollo-server-lambda');
const typeDefs = gql`
  directive @requireAuth on FIELD_DEFINITION
  type Query {
    users: [User]
    getUser(login: String, password: String): User
    institutes: [Institute]
    groups(id_institute: String): [Group]
    group(id: String): Group
    myGroups: [Group]
  }
  type User {
    login: String
    password: String
    token: String
    id: String
  }
  type Institute {
    id_institute: String
    title: String
    groups: [Group]
  }
  type Group {
    id_group: String
    title_group: String
    institute_id: String
    events: [Event]
  }
  type Event {
    id_event: String
    title_event: String
    location: String
    description: String
    start_time: String
    end_time: String
    id_group: String
  }
  type lol {
      kek: String
  }
  extend type Query {
    posts: [Post] @requireAuth
  }
  type Post {
    id: Int
    title: String
  }
  type Mutation {
    createGroup(title_group: String): Group
    createEvent(
      title_event: String,
      start_time: String,
      id_group: String,
      end_time: String, 
      description: String,
      location: String
    ) : Event
    changeEvent(
      id_event: String,
      title_event: String,
      start_time: String,
      id_group: String,
      end_time: String, 
      description: String,
      location: String
    ) : Event
    createUser(
      login: String,
      password: String,
    ) : User
    authentication(
      login: String,
      password: String,
    ) : User
  }
`
module.exports = typeDefs