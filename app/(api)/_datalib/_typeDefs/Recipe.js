import gql from 'graphql-tag';

const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
  }

  type Recipe {
    id: ID!
    title: String!
    ingredients: String!
    instructions: String!
    createdAt: String!
    updatedAt: String!
    author: Author
    reviews: [Review!]!
    averageRating: Float
    reviewCount: Int!
  }

  input RecipeInput {
    title: String!
    ingredients: String!
    instructions: String!
  }

  type Query {
    recipe(id: ID!): Recipe
    recipes(search: String): [Recipe!]!
  }

  type Mutation {
    createRecipe(input: RecipeInput!): Recipe!
    updateRecipe(id: ID!, input: RecipeInput!): Recipe!
    deleteRecipe(id: ID!): Boolean!
  }
`;

export default typeDefs;
