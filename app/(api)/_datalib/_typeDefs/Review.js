import gql from 'graphql-tag';

const typeDefs = gql`
  type Review {
    id: ID!
    name: String!
    description: String!
    rating: Int!
    clubReviewed: Club!
    clubID: String
   
  }

  input reviewInput {
    name: String!
    description: String!
    rating: Int!
    clubID: String!
  }

  type Query {
    review(id: ID!): Review
    reviews: [Review]
  }

  type Mutation {
    createReview(input: reviewInput!): Review
  }
`;
export default typeDefs;
