import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Post {
    id: ID!
    author: String!
    content: String!
    likes: Int!
    comments: Int!
    reposts: Int!
    views: Int!
    timestamp: String!
    imageUrl: String
    isReply: Boolean!
    parentPostId: ID
  }

  type Query {
    posts(page: Int!, limit: Int!): [Post!]!
  }

  type Mutation {
    likePost(id: ID!): Post!
  }

  type Subscription {
    newPost: Post!
  }
`;