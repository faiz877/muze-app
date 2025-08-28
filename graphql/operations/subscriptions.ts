// graphql/operations/subscriptions.ts
import { gql } from '@apollo/client';

export const NEW_POST_SUBSCRIPTION = gql`
  subscription newPost {
    newPost {
      id
      author
      content
      timestamp
      likes
      comments
      reposts
      views
      imageUrl
      isReply
      parentPostId
    }
  }
`;


