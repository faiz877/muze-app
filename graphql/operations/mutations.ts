// graphql/operations/mutations.ts
import { gql } from '@apollo/client';

export const LIKE_POST_MUTATION = gql`
  mutation LikePost($id: ID!) {
    likePost(id: $id) {
      id
      likes
    }
  }
`;


