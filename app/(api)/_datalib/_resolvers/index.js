import { mergeResolvers } from '@graphql-tools/merge';

import Recipe from './Recipe.js';
import Review from './Review.js';
import Pantry from './Pantry.js';
import Kitchen from './Kitchen.js';

const allResolvers = [];

const modules = [Recipe, Review, Pantry, Kitchen];
modules.forEach((module) => {
  allResolvers.push(module);
});

const resolvers = mergeResolvers(allResolvers);

export default resolvers;
