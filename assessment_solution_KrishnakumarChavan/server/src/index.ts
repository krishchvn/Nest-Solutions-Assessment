import { ApolloServer } from 'apollo-server';
import { resolvers } from './resolvers.ts';
import { typeDefs } from './typeDefs.ts';

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
	console.log(`Server running at ${url}`);
});
