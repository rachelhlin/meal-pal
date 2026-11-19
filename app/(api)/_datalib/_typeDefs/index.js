import { mergeTypeDefs } from '@graphql-tools/merge';

import Recipe from './Recipe.js';
import Review from './Review.js';
import Pantry from './Pantry.js';
import Kitchen from './Kitchen.js';

const allTypeDefs = [];

const modules = [Recipe, Review, Pantry, Kitchen];
modules.forEach((module) => {
  allTypeDefs.push(module);
});

const typeDefs = mergeTypeDefs(allTypeDefs);

export default typeDefs;
