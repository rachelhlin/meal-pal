import { mergeResolvers } from '@graphql-tools/merge';


import Club from './Club.js';
import Review from './Review.js';

const allResolvers = [];

const modules = [ Club, Review];
modules.forEach((module) => {
  allResolvers.push(module);
});

const resolvers = mergeResolvers(allResolvers);

export default resolvers;
