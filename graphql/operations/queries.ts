// graphql/operations/queries.ts
import { gql } from '@apollo/client';

export const GET_POSTS_QUERY = gql`
  query GetPosts($page: Int!, $limit: Int!) {
    posts(page: $page, limit: $limit) {
      id
      author
      content
      likes
      comments
      reposts
      views
      timestamp
      imageUrl
      isReply
      parentPostId
    }
  }
`;


