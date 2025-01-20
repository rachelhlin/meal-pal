import { mergeResolvers } from '@graphql-tools/merge';

import Recipe from './Recipe.js';
import Review from './Review.js';

const allResolvers = [];

const modules = [Recipe, Review];
modules.forEach((module) => {
  allResolvers.push(module);
});

const resolvers = mergeResolvers(allResolvers);

export default resolvers;
