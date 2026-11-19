import gql from 'graphql-tag';

const typeDefs = gql`
  type Substitution {
    missing: String!
    suggestion: String!
  }

  type PantryMatch {
    recipe: Recipe!
    matched: [String!]!
    missing: [String!]!
    score: Float!
    "null if ai wasn't used"
    reason: String
    substitutions: [Substitution!]!
  }

  type PantryRecommendations {
    "cleaned up, e.g. Tomatoes -> tomato"
    pantry: [String!]!
    matches: [PantryMatch!]!
    aiUsed: Boolean!
    "why ai was skipped, if it was"
    aiNote: String
  }

  type Query {
    recommendRecipes(
      ingredients: [String!]!
      useAi: Boolean = true
    ): PantryRecommendations!
  }
`;

export default typeDefs;
