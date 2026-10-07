import gql from 'graphql-tag';

const typeDefs = gql`
  type Review {
    id: ID!
    rating: Int!
    comment: String!
    createdAt: String!
    author: Author
    recipe: Recipe
  }

  input ReviewInput {
    rating: Int!
    comment: String!
    recipeId: ID!
  }

  type Query {
    review(id: ID!): Review
  }

  type Mutation {
    createReview(input: ReviewInput!): Review!
    deleteReview(id: ID!): Boolean!
  }
`;

export default typeDefs;
