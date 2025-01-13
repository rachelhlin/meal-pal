import gql from 'graphql-tag';

const typeDefs = gql`
  type Club {
    id: ID!
    name: String!
    description: String!
    rating: Int 
    reviews: [Review]

  }

  input ClubInput {
    name: String!
    description: String!
    rating: Int
    
  }

  type Query {
    club(id: ID!): Club
    clubs: [Club]
  }

  type Mutation {
    createClub(input: ClubInput!): Club
    addReview(playlistId: ID!, reviewId: ID!): Boolean
  }
`;
export default typeDefs;
