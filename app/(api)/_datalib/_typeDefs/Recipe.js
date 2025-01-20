import gql from 'graphql-tag';

const typeDefs = gql`
  type Recipe {
    id: ID!
    title: String!
    ingredients: String!
    instructions: String!
    createdAt: String!
    updatedAt: String!
    reviews: [Review]
  }

  input RecipeInput {
    title: String!
    ingredients: String!
    instructions: String!
  }

  type Query {
    recipe(id: ID!): Recipe
    recipeSearch(title: String!): Recipe
    recipes: [Recipe]
  }

  type Mutation {
    createRecipe(input: RecipeInput!): Recipe
  }
`;

export default typeDefs;
