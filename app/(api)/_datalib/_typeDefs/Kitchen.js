import gql from 'graphql-tag';

const typeDefs = gql`
  type PantryItem {
    id: ID!
    name: String!
  }

  type GroceryItem {
    id: ID!
    name: String!
    checked: Boolean!
    "the recipe it was added for, if any"
    recipe: Recipe
  }

  type GroceryAddResult {
    "how many new items went on the list"
    added: Int!
    items: [GroceryItem!]!
  }

  type Query {
    myPantry: [PantryItem!]!
    myGroceryList: [GroceryItem!]!
  }

  type Mutation {
    addPantryItems(names: [String!]!): [PantryItem!]!
    removePantryItem(name: String!): Boolean!
    clearPantry: Boolean!

    addGroceryItems(names: [String!]!, recipeId: ID): GroceryAddResult!
    addMissingToGroceryList(recipeId: ID!): GroceryAddResult!
    setGroceryChecked(id: ID!, checked: Boolean!): GroceryItem!
    removeGroceryItem(id: ID!): Boolean!
    clearCheckedGroceries: Int!
    moveCheckedToPantry: Int!
  }
`;

export default typeDefs;
