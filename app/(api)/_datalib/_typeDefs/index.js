import { mergeTypeDefs } from '@graphql-tools/merge';


import Club from './Club.js';
import Review from './Review.js';

const allTypeDefs = [];

const modules = [ Club, Review];
modules.forEach((module) => {
  allTypeDefs.push(module);
});

const typeDefs = mergeTypeDefs(allTypeDefs);

export default typeDefs;
