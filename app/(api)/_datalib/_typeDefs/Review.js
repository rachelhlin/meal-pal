import gql from 'graphql-tag';

const typeDefs = gql`
  type Review {
    id: ID!
    rating: Int!
    comment: String!
    createdAt: String!
    updatedAt: String!
    recipe: Recipe
  }

  input ReviewInput {
    rating: Int!
    comment: String!
    recipeId: ID!
  }

  type Query {
    review(id: ID!): Review
    reviews: [Review]
  }

  type Mutation {
    createReview(input: ReviewInput!): Review
  }
`;

export default typeDefs;
