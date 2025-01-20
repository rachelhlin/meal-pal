import { mergeTypeDefs } from '@graphql-tools/merge';


import Recipe from './Recipe.js';
import Review from './Review.js';

const allTypeDefs = [];

const modules = [Recipe, Review];
modules.forEach((module) => {
  allTypeDefs.push(module);
});

const typeDefs = mergeTypeDefs(allTypeDefs);

export default typeDefs;
